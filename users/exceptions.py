class InvalidPhoneNumberException(Exception):
    def __init__(self, message="Số điện thoại không hợp lệ"):
        self.message = message
        super().__init__(self.message)
