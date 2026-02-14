import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  type PhotoMetadata = {
    id : Text;
    name : Text;
    contentType : Text;
    timestamp : Int;
    blob : Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  // Data storage
  let photos = Map.empty<Text, PhotoMetadata>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let shortLinks = Map.empty<Text, Text>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Photo gallery functions
  public shared ({ caller }) func addPhoto(id : Text, name : Text, contentType : Text, timestamp : Int, blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload photos");
    };
    let newPhoto = {
      id;
      name;
      contentType;
      timestamp;
      blob;
    };
    photos.add(id, newPhoto);
  };

  public query ({ caller }) func listPhotos() : async [PhotoMetadata] {
    // All visitors (including guests) can list photos
    photos.values().toArray();
  };

  public query ({ caller }) func getPhoto(id : Text) : async ?PhotoMetadata {
    // All visitors (including guests) can view photos
    photos.get(id);
  };

  public query ({ caller }) func canUpload() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getGalleryStats() : async (Nat, Nat) {
    let numPhotos = photos.size();
    let numUsers = userProfiles.size();
    (numPhotos, numUsers);
  };

  public query ({ caller }) func getPhotoByShortCode(shortCode : Text) : async ?PhotoMetadata {
    switch (shortLinks.get(shortCode)) {
      case (null) { null };
      case (?photoId) { photos.get(photoId) };
    };
  };

  public shared ({ caller }) func addShortLink(id : Text, shortCode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create short links");
    };
    if (not photos.containsKey(id)) {
      Runtime.trap("Photo does not exist");
    };
    shortLinks.add(shortCode, id);
  };

  public query ({ caller }) func resolveShortLink(shortCode : Text) : async ?Text {
    shortLinks.get(shortCode);
  };
};
