from django.urls import include, path

from . import views

urlpatterns = [
    path('accounts/', include('django.contrib.auth.urls')),
    path('signup/', views.signup, name='signup_page'),
    path('profiles/checkin', views.checkin),
    path('profiles/checkout', views.checkout),
]
