def update_form_field_choices(field, choices):
    field.choices = choices
    field.widget.choices=choices
    
