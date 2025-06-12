from djoser.email import ActivationEmail, PasswordResetEmail


class CustomActivationEmail(ActivationEmail):
    template_name = "emails/activation.html"


class CustomPasswordResetEmail(PasswordResetEmail):
    template_name = "emails/password_reset.html"