class EmailStore:
    def __init__(self):
        pass
    def save_email(self, email_id):
        self.email = email_id
    def get_email(self):
        return self.email

# # A global instance of EmailStore to hold the email value
# email_store = EmailStore()

# def save_email(email_id):
#     """
#     Saves the email ID into the global EmailStore instance.
#     """
#     print(type(email_id))  # Debugging: Print the type of email_id
#     email_store.email = email_id
#     print("save_email", email_id)
    
# def get_email():
#     """
#     Retrieves the email ID from the global EmailStore instance.
#     """
#     print("get_email", email_store.email)
#     return email_store
