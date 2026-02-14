import Map "mo:core/Map";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    photos : Map.Map<Text, { id : Text; name : Text; contentType : Text; timestamp : Int; blob : Storage.ExternalBlob }>;
    userProfiles : Map.Map<Principal, { name : Text; email : ?Text }>;
  };

  type NewActor = {
    photos : Map.Map<Text, { id : Text; name : Text; contentType : Text; timestamp : Int; blob : Storage.ExternalBlob }>;
    userProfiles : Map.Map<Principal, { name : Text; email : ?Text }>;
    shortLinks : Map.Map<Text, Text>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      shortLinks = Map.empty<Text, Text>()
    };
  };
};
