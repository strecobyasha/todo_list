from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):

    def _create_user(self, email, password, is_staff, is_active, is_superuser, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, is_staff=is_staff, is_active=is_active, is_superuser=is_superuser, **extra_fields)
        user.set_password(password)
        user.save()

        return user

    def create_user(self, email, password, **extra_fields):
        return self._create_user(email, password, is_staff=False, is_active=False, is_superuser=False, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, is_staff=True, is_active=True, is_superuser=True, **extra_fields)
