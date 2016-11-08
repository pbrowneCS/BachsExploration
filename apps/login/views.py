from django.shortcuts import render, redirect, HttpResponse
from django.core.urlresolvers import reverse
from .models import User
from django.contrib import messages

def index(request):
	try:
		request.session['logged_in']
		return redirect(reverse('game_main'))
	except KeyError:
		return render(request, 'login/index.html')

def createUser(request):
	userdata = request.POST
	results = User.userManager.register(userdata, request)

	if results[0] == True:
		messages.success(request, "Success! Please login.")
		return redirect(reverse('login_index'))
	else: 
		return redirect(reverse('login_index'))

def login(request):
	logindata = request.POST
	results = User.userManager.login(logindata, request)
	if results[0] == True:
		if 'logged_in' not in request.session:
			request.session['logged_in'] = User.objects.get(username=logindata['username']).id
			
			return redirect(reverse('game_main'))
		else:
			return redirect(reverse('login_index'))
	else:
		return redirect (reverse('login_index'))


