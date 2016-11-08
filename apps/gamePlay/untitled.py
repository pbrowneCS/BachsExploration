from __future__ import unicode_literals
from django.db import models
from ..login.models import User

class GameManager(models.Manager):
	
	def createGame(self, data):

		game = Game.objects.create(user=data['user'], char_name=data['char_name'])	
		return True



	
class Game(models.Model):
	user = models.ForeignKey(User)
	level = models.IntegerField(default=1)
	score = models.IntegerField(default=0)
	char_name = models.CharField(max_length = 32, default="Player")
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now=True)
	gameManager = GameManager()
	objects = models.Manager()

class Save(models.Model):
	save_name = models.CharField(max_length = 32, default = "AutoSave1")
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)




		