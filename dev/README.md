# Dev FB Scripts
Fogbugz scripts for quickly editing and categorizing tickets. This will auto-update once per day by default (you can change this in your tampermonkey settings), so you should automatically receive any updates made. If you need a fix immediately, click the tampermonkey icon next to the url bar in your browser and select 'Check for userscript updates', or you can re-install the most up-to-date version manually by clicking the link in step 2. Please contact Aaron Cooper via HipChat to report a bug or if you have any suggestions.

## Features:
-Automatically assigns a priority based on 'Customer Impact' and 'Probability of Occurrence' selections<br>
-Adds quick buttons for assigning to yourself, setting a case to Bug Backlog/Up For Grabs/Low/Low/Green (named 'Do The Needful'), or assigning Red, Yellow, or Green priorities. Try not to use the back button.<br>
-Any scroll events past the min or max for a dropdown list will not get transferred to the parent window (more scroll acceleration friendly)

## Upcoming:
-TBD (suggestions welcome)

## Install:
1. Download Tampermonkey<br>
-<a href='https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en' target='_blank'>Tampermonkey for Chrome</a><br>
-<a href='https://addons.mozilla.org/en-Us/firefox/addon/tampermonkey/' target='_blank'>Tampermonkey for Firefox</a><br>
-<a href='http://tampermonkey.net/?browser=safari' target='_blank'>Tampermonkey for Safari</a>

2. Install the autoEdits script by clicking <a href='https://github.com/aHoyleCooper/fbScripts/raw/master/dev/fbAutoEdits.user.js' target='_blank'>here</a>

3. Done! To test, go to <a href='http://fogbugz/' target='_blank'>Fogbugz</a> and edit a case
