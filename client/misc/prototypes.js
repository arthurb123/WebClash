String.prototype.hashCode = function() {
    let hash = sha256.create();
    hash.update(this.toString());
    return hash.hex();
};