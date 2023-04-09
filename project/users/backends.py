from django.contrib.auth.backends import ModelBackend

from .models import CustomUser


class UserBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = CustomUser.objects.get(email=username)
        except CustomUser.DoesNotExist:
            return None
        else:
            if user.check_password(password) is True:
                return user
        return None
