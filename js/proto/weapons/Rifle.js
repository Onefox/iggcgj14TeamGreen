define([
	"modules/mouse",
	"proto/entities/bullets/Shot"
], function(mouse, Shot) {
	var Rifle = function Rifle(actor) {
		this.shooting = false;
		this.actor = actor;
		this.cooldown = 0;

		this.maxCooldown = 150;

		this.ammo = this.ammoMax = 20;
		this.reloadTime = 1000;
		this.reloading = false;
	};

	Rifle.prototype.update = function(delta) {
		var speed,
			status,
			center,
			move;

		if (this.cooldown > 0) {
			this.cooldown -= delta;
		}

		if (this.ammo < 1) {
			//sound.play('sound/fx/laser/laser-reload.ogg');
			this.cooldown = this.reloadTime;
			this.ammo = this.ammoMax;
			this.reloading = true;
		} else if (this.shooting && this.cooldown <= 0) {
			this.reloading = false;
			this.ammo--;

			speed = 0.5;
			center = this.actor.getCenter();
			move = mouse.sum(window.game.scene.view.p1).dif(center).norm().prd(speed);

			window.game.scene.add(new Shot(center.x, center.y, move));

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

	Rifle.prototype.fire = function() {
		this.shooting = true;
	};

	Rifle.prototype.stop = function() {
		this.shooting = false;
	};

	return Rifle;
});