[PL](../readme.md) / [EN](Docs/readmeEN.md)

# UZPlan

UZPlan is a plugin that greatly facilitates the reading of the timetable which is made available to students of all majors at the link plan.uz.zgora.pl. The default way of presenting the plan in the form of a list, I found not very readable, so I decided to make my own implementation based on the data displayed to the user.

The plug-in is under development - ergo, as the creator, I do not take responsibility for the possible possibility of incorrect display of classes.

# Table of contents
- [UZPlan](#uzplan)
- [Table of contents](#table-of-contents)
- [Usage](#usage)
- [How to install](#how-to-install)
- [Description of operation](#description-of-operation)
- [List of functions](#list-functions)

# Usage
The plug-in is ready to use after installation. It does not require any additional configuration. The first time it is launched, the user should go to the plan page of a particular group, and then the plug-in window should be opened. The user should now select the groups to which he/she has been assigned, using the checkboxes. Information about the classes, and about the selected groups, is updated each time the user enters the schedule page. In the case of running the plug-in without the Internet, or being on another page, a schedule based on the last timetable visited will be displayed. 

The design of the extension window consists of three layers, from the top : 
- A set of buttons to operate the plug-in, which are responsible for changing the displayed week, and returning to the current one.
- A set of checkboxes for setting student groups.
- A generated table of classes.


# How to install
The default way to install is to download the plugin using sites such as :
- Chrome web store
- Opera addons
- Microsoft Edge addons

However, the plug-in can be installed bypassing the official stores. For example, for the Opera browser :
1. in the extensions menu, select Developer mode in the upper right corner
2. download the plug-in, extract the contents of the zip archive to a folder
3. press the "Load Unzipped" button.
4. select the folder with the unzipped contents, and confirm.

# Action Description

The plug-in uses the Content Script mechanism to retrieve table content from a university page. Using standard functions executed on the DOM tree, the table content is converted from the form of HTML elements to an array of arrays. A single entry in such an array contains all the data displayed to the user, in the order of : 
```
["date", "dayofWeek", "group", "starttime", "endtime", "classtype", "instructor", "room"].
```
Such aggregated data, is sent using chrome.runtime API to the javascript of the plug-in window, which sends a request to receive the aforementioned data every time the window is opened. 

When the plug-in receives the set, it proceeds to update the contents of Local Storage with the new version of the set, and then all functions to display the contents of the plan are executed.

In case the plug-in does not obtain the set, it refers to the last saved copy in Local Storage and it is on this copy that the plan display is based.

# List of functions

The list of functions is available at this [link](documentationEN.md)




# Translated
Translated with DeepL.com (free version)