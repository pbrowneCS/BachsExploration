from django.shortcuts import render, redirect, HttpResponse
from django.core.urlresolvers import reverse
from .models import Game, Save, LeaderBoard
from ..login.models import User

def main(request):
	try:
		request.session['logged_in']
		user = User.objects.get(id=request.session['logged_in'])
		games = Game.objects.filter(user=user)
		saves = Save.objects.all()
		leaders = LeaderBoard.objects.all().order_by('-score')[0:10]

		# order_by('score').get()


		context = {
			'saves': saves,
			'games': games,
			'leaders': leaders
		}
		return render(request, 'gamePlay/main.html', context)
	except KeyError:
		return redirect(reverse('login_index'))


def new(request):
	try:
		request.session['logged_in']
		data = {
			'user': User.objects.get(id=request.session['logged_in']),
			# 'char_name': request.POST['char_name']
		}

		results = Game.objects.create(user=data['user'])
		return redirect(reverse('game_play', kwargs={'id':results.id}))
	
	except KeyError:
		return redirect(reverse('login_index'))

def play(request, id):
	try:
		request.session['logged_in']
		game = Game.objects.get(id=id)
		context = {
			'game':game, 
			'game_id': id
		}
		return render(request, 'gamePlay/game.html', context)
	except KeyError:
		return redirect(reverse('login_index'))	

def saveGame(request, id):
	if request.method == 'POST':
		if request.is_ajax():
			game = Game.objects.get(id=id)
			save = Save.objects.create(save_name=request.POST.get('save_name'),game_id=game.id, level=request.POST.get('level'), score=request.POST.get('score'))
			save.save()
			print save.save_name, save.game_id
		
	return redirect(reverse('game_play', kwargs={'id':id}))

def leaderBoard(request):
	if request.method == 'POST':
		user_name = User.objects.get(id=request.session['logged_in']).username
		lb = LeaderBoard.objects.create(user=user_name, score=request.POST['score'])
		lb.save()
		return HttpResponse('success')
	


# def restart(request):
# 	return HttpResponse('boool')

def loadGame(request, id):
	obj = Game()
	obj.args = [{'projectiles':data['projectiles'], 'enemies':data['enemies'], 'level':data['level'], 'player':data['player']}]
	obj.save()
	new = Game.gameManager.createGame(request, data)


def quit(request):
	return redirect(reverse('game_main'))

def logout(request):
	request.session.clear()
	return redirect (reverse('login_index'))


