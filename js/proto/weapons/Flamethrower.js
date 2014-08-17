define([
	"modules/mouse",
	"proto/entities/animations/Acid",
	"proto/V2",
	"proto/entities/characters/Enemy",
	"helper/dom"
], function(mouse, Acid, V2, Enemy, dom) {
	var Flamethrower = function Flamethrower(actor) {
		this.shooting = false;
		this.actor = actor;
		this.cooldown = 0;
		this.animation =

		this.maxCooldown = 1;

		this.ammo = this.ammoMax = 1;
		this.reloadTime = 2000;
		this.reloading = false;
	};

	Flamethrower.prototype.update = function(delta) {
		var speed,
			status,
			center,
			move;
		this.actor = game.scene.getChar('lina');

		if (this.cooldown > 0) {
			this.cooldown -= delta;
			dom.get("inner2").style.height = 100-(~~(((this.reloadTime - this.cooldown) / this.reloadTime) * 100)) + "%";
		}

		if (this.ammo < 1) {
			//sound.play('sound/fx/laser/laser-reload.ogg');
			this.cooldown = this.reloadTime;
			this.ammo = this.ammoMax;
			this.reloading = true;
		} else if (this.shooting && this.cooldown <= 0) {
			this.reloading = false;
			this.ammo--;

			var center = this.actor.getCenter();
			var shotangle = this.actor.directionVec.angle2();
			var entities = game.scene.entities;

			for( var i = 0; i < entities.length; i++ ) {
				if( entities[i] instanceof Enemy ) {
					var dist = center.dist( entities[i].getCenter());
					var vicangle = center.angle( entities[i].getCenter());
					var diff = Math.abs( vicangle - shotangle );

					if( dist < 200 && diff < .5 ) {
						entities[i].kill();
					}
				}
			}

			speed = 0.5;
			center = this.actor.getCenter();
			move = this.actor.directionVec.norm().prd(speed);

			if (this.animation) {
				window.game.scene.add(this.animation = new Acid(center.x, center.y, move));
				dom.get("inner2").style.height = "100%";
			}
			//sound.play('sound/fx/laser/laser.ogg');
			this.cooldown = this.maxCooldown;
		}

		if (this.reloading) {
			status = this.cooldown / this.reloadTime;
		} else {
			status = 1 - this.ammo / this.ammoMax;
		}

		//map.ui.setReloadStatus( status );
	};

	Flamethrower.prototype.fire = function() {
		this.shooting = true;
	};

	Flamethrower.prototype.stop = function() {
		this.shooting = false;
	};

	return Flamethrower;
});