from __future__ import unicode_literals
from django.db import models
from ..login.models import User

class Game(models.Model):
	user = models.ForeignKey(User)	
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	objects = models.Manager()

class Save(models.Model):
	save_name = models.CharField(max_length=45, default="AutoSave")
	game = models.ForeignKey(Game)
	char_name = models.CharField(max_length=45)
	level = models.IntegerField(default=0)
	score = models.IntegerField(default=1)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

class LeaderBoard(models.Model):
	user = models.CharField(max_length=45)
	score = models.IntegerField(default=1)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)