import Map "mo:core/Map";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type PhotoMetadata = {
    id : Text;
    name : Text;
    contentType : Text;
    timestamp : Int;
    blob : Storage.ExternalBlob;
  };

  // Store data (content + metadata)
  let photos = Map.empty<Text, PhotoMetadata>();

  public shared ({ caller }) func addPhoto(id : Text, name : Text, contentType : Text, timestamp : Int, blob : Storage.ExternalBlob) : async () {
    let newPhoto : PhotoMetadata = {
      id;
      name;
      contentType;
      timestamp;
      blob;
    };
    photos.add(id, newPhoto);
  };

  public query ({ caller }) func listPhotos() : async [PhotoMetadata] {
    photos.values().toArray();
  };

  public query ({ caller }) func getPhoto(id : Text) : async ?PhotoMetadata {
    photos.get(id);
  };
};
