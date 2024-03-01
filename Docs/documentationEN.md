[PL](../documentation.md) / [EN](Docs/documentationEN.md)

## runExtension()

Wrapper for all the plugin logic. It includes declarations of basic variables passed between the other functions, fetching the DOM tree elements, eventListeners, and calling the basic functions so that when the window is opened, the timetable for the current week is shown on base. 

The contents of this function can be described in sequence as :

- Assigning all variables, retrieving checkboxes from localstorage using [getCheckboxesFromLocalStorage]
(#getcheckboxesfromlocalstorage), retrieving an array of classes from localstorage.
- Filter the array of classes, to those that are in the current week, using [makeListOfWeek](#makelistofweekoffset-array)
- Render the possible checkboxes using [groupCheckboxes](#groupcheckboxesarray)
- Rendering an array with the current week using [basicWeek](#basicweekarray)
- Adding an eventListener for the button responsible for undoing the week. Within it, editing of the displayed week takes place, filtering of the classes for checked checkboxes using [filterByCheckboxes](#filterbycheckboxesarray-checkboxesarray), then sorting by time thanks to [sortByTime](#sortbytimearray), and finally rendering of the schedule - [renderTimetable](#rendertimetablearray); 
- Adding an eventListener for the button responsible for moving to the next week. This is done analogously to the above.
- Adding an eventListener for all checkboxes. Within it, the function return [getCheckedCheckboxes](#getcheckedcheckboxes) is called to assign a variable, and then local storage is updated with the new value of this variable. Next, the functions responsible for "processing" the data and displaying it are called, analogous to previous eventlisteners.
- Adding an eventListener for the week reset button. Calls functions analogous to the previous week, next week buttons, except that it displays the current week.

## renderTimetable(array)

The function takes a properly processed array, containing an array of classes. It includes retrieving the array into which the classes will be entered, and mapping the corresponding text values of the days of the week , to digits for later comparison. Subsequently, it calls the function [cleanTimetable](#cleantimetable), after which it starts the process in which the values of the start time of the classes, and the end time of the classes, are downloaded into separate arrays. An additional step in this process is to validate that the length of one array is equal to the other, so as to avoid display problems. The final element is a nested for loop, with the outer loop iterating over the start hours of the classes, and the inner loop iterating over the consecutive days of the week. The column with index zero is assigned the hours of classes, and then for the other columns, a condition is checked to see if the day and time match. If yes - a div is generated, containing all the information about the lesson, if not, the table cell remains empty.

## cleanTimetable()

This function takes the currently displayed timetable and then deletes its rows, except for the row with index 0 containing the names of the days of the week.


## returnDatesInWeek(offset*).

The function is responsible for returning a list of days that are in the current week. The week that is returned can be changed by specifying the optional offset value in the call. By default, it is initialized as 0. Specifying a minus value will return dates earlier than the current week, while positive values will return dates later than the current week.



## makeListOfWeek(offset*, array)

This function returns the classes that take place in the week specified by offset. By default, it returns the classes taking place in the current week.
Calls [returnDatesInWeek](#returndatesinweekoffset) with the specified offset, then using [isInDate](#isindatedatefromto) populates the array with only those results that have passed verification.


## isInDate(date,from,to)

This function checks if the specified date (date) is between the other two (from, to).

## getCheckedCheckboxes()

This function is responsible for retrieving information about the checked checkboxes within the plugin. It returns an array that has the names of the checked checkboxes listed.

## filterByCheckboxes(array, checkboxesArray).

This function filters an array of classes, by the groups selected by the user. CheckboxesArray is the array obtained from the [getCheckedCheckboxes](#getcheckedcheckboxes) function.

## getCheckboxesFromLocalStorage()

This function gets the checked checkboxes from Local Storage. In the absence of a corresponding object, it returns an empty array. 

## tickCheckboxesFromLocalStorage()

This function retrieves checkboxes from Local Storage, and then sets the corresponding HTML elements to checked = true.

## groupCheckboxes(array)

This function extracts information about selectable groups from the passed array of classes. In addition, it creates the corresponding HTML elements and inserts them into the plug-in window.

The only exception, are classes which are intended for the WHOLE group, i.e. lectures, whose designation in the retrieved array of classes exists as ' ' - white sign. In this case, their value is changed to 'Whole group' which is important when using other functions regarding checkboxes.

## sortByTime(array)

A function that sorts the array by the 'timeBeginning' column. Helpfully calls the function [convertToMinutes](#converttominutestime) Returns a sorted array.

## convertToMinutes(time)

This function converts time from a string type data in "hh:mm" format to int format. This facilitates the time comparison operation used with [sortByTime](#sortbytimearray). It takes the value of the time variable, then divides it into two parts - hours, and minutes. It then multiplies the number of hours times 60, and adds the minute part, while casting both values to Int type. For example, for the call time = "01:21", the number 81 is returned.

## basicWeek(array)

This function is responsible for displaying the current week immediately after opening the plug-in window. Calls array :
- [tickCheckboxesFromLocalStorage](#tickcheckboxesfromlocalstorage)
- [cleanTimeTable](#cleantimetable)
- [filterByCheckboxes](#filterbycheckboxesarray-checkboxesarray) using the given array - array, and calling [getCheckboxesFromLocalStorage](#getcheckboxesfromlocalstorage). The return from this function then overwrites the array.
- [sortByTime](#sortbytimearray)
- [renderTimetable](#rendertimetablearray)
- using querySelector sets the corresponding value in the date div.

# Translated
Translated with DeepL.com (free version)