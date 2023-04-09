from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render

from .forms import CustomUserCreationForm


def signup(response):
    if response.method == 'POST':
        form = CustomUserCreationForm(response.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.save()
            return HttpResponseRedirect('/')
    else:
        form = CustomUserCreationForm()

    return render(response, 'signup.html', {'form': form})


@login_required
def checkin(request):
    return HttpResponseRedirect('/')


def checkout(request):
    return HttpResponseRedirect('/')
