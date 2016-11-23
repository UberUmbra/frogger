var AnimatedSprite = function(x, y, sprite) {
    this.x= x ? x : 0;
    this.y= y ? y : 0;
    this.sprite = sprite;
};

AnimatedSprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};