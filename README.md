![](extras/plugin-preview.png)

# Description

A special SurveyCTO plugin designed for teletrainers. Now, they can easily make Freshdesk tickets for patient questions right within SurveyCTO. No extra steps of opening Freshdesk separately needed.

[![Download now](extras/download-button.png)](https://github.com/NooraHealth/fd-ticket-scto-plugin/raw/main/fd-ticket.fieldplugin.zip)

[Freshdesk](https://www.freshworks.com/freshdesk/) is a powerful and intuitive cloud-based ticketing system that enables companies to streamline customer support, automate workflows, and deliver personalized service through a unified platform

## Required parameters

| Key                     | Value                                                                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `patientName`         | This is the name of the patient who has raised a query with the teletrainer                                                                                                                           |
| `phoneNumber`         | This is the phone number of the user who has raised a query                                                                                                                                           |
| `patientQuery`        | This is query raised by the user which needs to be escalated to doctors for resolution                                                                                                                |
| `agentEmail`          | This is the email address of the Teletrainer who used the SurveyCTO plugin to raise the query on Freshdesk. It should match the email address they used to sign up for an agent account on Freshdesk. |
| `projectId`           | This will be the project name attribute on the Freshdesk Ticket                                                                                                                                       |
| `familyConnectedOnWa` | This will be a Yes/No question used to inform the medical executive whether the user wants the answer to their query on WhatsApp or not.                                                              |
| `language`            | This specifies the language preference of the user, this will be used to send the answer back on Whatsapp.                                                                                            |
| `apiToken`            | This is the authentication token required by the API endpoint.                                                                                                                                        |
| `apiUrl`              | This is the URL of the API endpoint that will be invoked to create a ticket on Freshdesk.                                                                                                             |
| `fdUrl`               | This is the URL of our Freshdesk workspace, which will be used to populate this field with a link to the ticket on Freshdesk.                                                                         |
| `callName`            | This will contain the name of the form used to create the ticket on Freshdesk, providing context about the query for the Freshdesk ticket.                                                            |
| `countryName`         | This will contain the name of the country the ticket needs to be assigned such as `India`, `Bangladesh` etc.                                                                                      |

## Testing the Plugin

To test this plugin, follow these steps:

### 1. Download the Test Form

Download the test form from the `extras/test-form/` directory in this repository. The test form file is `fd-plugin-demo.xlsx`.

### 2. Upload the Test Form to SurveyCTO

Follow the guide at [Working with spreadsheet form definitions](https://support.surveycto.com/hc/en-us/articles/4613295552275-Working-with-spreadsheet-form-definitions-1-Creating-and-uploading#2) to upload the test form to your SurveyCTO server.

### 3. Download and Upload the Plugin

- Download the plugin file (`fd-ticket.fieldplugin.zip`) from the download link above

   > **Note**: Ensure the file name doesn't contain any trailing numbers like `(1)`, `(2)` which are automatically added by your system if you already have the plugin downloaded. Remove these and ensure the file name follows the format: `fd-ticket.fieldplugin.zip`

- Follow the guide at [Using field plug-ins](https://docs.surveycto.com/02-designing-forms/03-advanced-topics/06.using-field-plug-ins.html) to attach the plugin as an attachment to your form

### 4. Configure the Plugin

Once the plugin is attached, you can configure it by setting the appearance of the relevant field to `custom-fd-ticket` and adding the required parameters (see below).

### 5. Update Configuration for Production

> **Note**: Before using this form in `production`, you must update the following values in the sample form:

- **`apiUrl`** and **`apiToken`**: Contact Abhishek to obtain the correct API credentials for your environment
- **`projectId`**: Update this value to match your specific project requirements

These values are currently set to placeholder/default values in the test form and need to be configured properly for the plugin to function correctly in production.

## More resources

* **Test form**
  [extras/test-form](./extras/test-form/fd-plugin-demo.xlsx)
