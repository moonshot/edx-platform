"""
Course Textbooks page.
"""

import requests
from path import path  # pylint: disable=no-name-in-module
from .course_page import CoursePage
from .utils import click_css


class TextbooksPage(CoursePage):
    """
    Course Textbooks page.
    """

    url_path = "textbooks"

    def is_browser_on_page(self):
        return self.q(css='body.view-textbooks').present

    def open_add_textbook_form(self):
        """
        Open new textbook form by clicking on new textbook button.
        """
        self.q(css='.nav-item .new-button').click()

    def get_element_text(self, selector):
        """
        Return the text of the css selector.
        """
        return self.q(css=selector)[0].text

    def set_input_field_value(self, selector, value):
        """
        Set the value of input field by selector.
        """
        self.q(css=selector)[0].send_keys(value)

    def upload_pdf_file(self, file_name):
        """
        Uploads a pdf textbook.
        """
        # If the pdf upload section has not yet been toggled on, click on the upload pdf button
        test_dir = path(__file__).abspath().dirname().dirname().dirname()
        file_path = test_dir + '/data/uploads/' + file_name

        click_css(self, ".edit-textbook .action-upload", require_notification=False)
        self.wait_for_element_visibility(".upload-dialog input", "Upload modal opened")
        file_input = self.q(css=".upload-dialog input").results[0]
        file_input.send_keys(file_path)
        click_css(self, ".wrapper-modal-window-assetupload .action-upload", require_notification=False)
        self.wait_for_element_absence(".upload dialog", "Upload modal closed")

    def click_textbook_submit_button(self):
        """
        Submit the new textbook form and check if it is rendered properly.
        """
        def click_save():
            """
            Continue to click the save button until the form is no longer present. Without this,
            the test sporadically fails because the click is too early.
            """
            save_button = self.q(css='#edit_textbook_form button[type="submit"]').results
            if len(save_button) > 0:
                save_button[0].click()
            return not self.q(css="#edit_textbook_form").present

        self.wait_for(click_save, "Editing form should close.")

    def is_view_live_link_worked(self):
        """
        Check if the view live button of textbook is working fine.
        """
        try:
            self.wait_for(lambda: len(self.q(css='.textbook a.view').attrs('href')) > 0, "href value present")
            response = requests.get(self.q(css='.textbook a.view').attrs('href')[0])
        except requests.exceptions.ConnectionError:
            return False

        return response.status_code == 200
