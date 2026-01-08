import re
from django.core.exceptions import ValidationError


class ComplexPasswordValidator:
    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                'Password must contain at least one uppercase letter.',
                code='password_no_upper',
            )
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                'Password must contain at least one lowercase letter.',
                code='password_no_lower',
            )
        if not re.search(r'[0-9]', password):
            raise ValidationError(
                'Password must contain at least one number.',
                code='password_no_number',
            )
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValidationError(
                'Password must contain at least one special character.',
                code='password_no_special',
            )

    def get_help_text(self):
        return 'Password must contain uppercase, lowercase, number, and special character.'
