from __future__ import unicode_literals
from django.db import models
from django.contrib import messages

import re
import bcrypt

USERNAME_REGEX = re.compile(r'^[a-zA-Z0-9]+$')
NAME_REGEX = re.compile(r'[a-zA-Z]+( [a-zA-Z0-9]+)*$')
# PASSWORD_REGEX = re.compile(r'^(?=.*?[A-Z]).*\d$')

class UserManager(models.Manager):

	def register(self, userdata, request):
		errors = False

		if self.filter(username=userdata['username']).exists():
			messages.warning(request, "Username already exists.") 
			errors = True

		if len(userdata['name']) < 3:
			messages.warning(request, "Name must be at least 3 characters.")
			errors = True
		elif not NAME_REGEX.match(userdata['name']):
			messages.warning(request, "Name cannot contain numbers or symbols.")
			errors = True

		if len(userdata['username']) < 3:
			messages.warning(request, "Username must be at least 3 characters.")
			errors = True
		elif not USERNAME_REGEX.match(userdata['username']):
			messages.warning(request, "Invalid username.")
			errors = True

		if len(userdata['password']) < 3:
			messages.warning(request, "Password must be at least 3 characters.")
			errors = True
		# elif not PASSWORD_REGEX.match(userdata['password']):
		# 	messages.warning(request, "Password must contain at least one uppercase letter and one number.")
		# 	errors = True

		if len(userdata['passrepeat']) < 1:
			messages.warning(request, "Password confirmation cannot be blank.")
			errors = True
		elif not userdata['passrepeat'] == userdata['password']:
			messages.warning(request, "Passwords do not match!")
			errors = True

		password = userdata['password'].encode('utf-8')
		hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

		if errors:
			return (False, messages)
		else:
			user = self.create(name=userdata['name'], username=userdata['username'], password=hashed)
			return(True, user, user.id)

	def login(self, logindata, request):
		errors = False
		person = self.filter(username__exact=logindata['username'])
		
		if person:
			person = person[0]
		else:
			messages.warning(request, "Invalid credentials.")
			errors = True
			return (False, messages)
		
		if person.password == bcrypt.hashpw(logindata['password'].encode('utf-8'), person.password.encode('utf-8')):
			return (True, person)
		else:
			messages.warning(request, "Invalid credentials.")
			errors = True
			return (False, messages)

class User(models.Model):
	name = models.CharField(max_length=45)
	username = models.CharField(max_length=255)
	password = models.CharField(max_length=100)
	userManager = UserManager()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	objects = models.Manager()


	

# Create your models here.
