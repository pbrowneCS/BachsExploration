from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.main, name='game_main'),
    url(r'^new$', views.new, name='game_new'),
    url(r'^play/(?P<id>\d+)$', views.play, name='game_play'),
    url(r'^save/(?P<id>\d+)$', views.saveGame, name='game_save'),
    url(r'^quit$', views.quit, name='game_quit'),
    url(r'^leaderboard$', views.leaderBoard, name='game_rank'),
	url(r'^logout$', views.logout, name = 'logOut'),
]