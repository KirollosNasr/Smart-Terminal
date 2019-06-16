# Smart Terminal

## Overview

Linux is an open source free operating system that is mainly depends on bash programming language , most newcomers face a difficulty in how to use this new environment.
Many users may consider using bash scripts a nightmare for them, so a user friendly layer can solve this problem as it can take its orders in a natural language `ie : English` and it then tries to estimate what you want to do

`> please I want to make a new folder called "new folder"`

then it will convert your words to something like 

`mkdir "./new folder"`

`> please open my cd-rom now`

to 

`eject`

## Data

Unfortunately a dataset with all features we need was a hard target to obtain. we choose to build a few thousands of records depending on a mixture of Combinations and words synonyms in a programmatic way. each record consists of a way of natural language command and its corresponding bash response 


-  i wish to realize how much desktop has been working , uptime -p
-  i need to drop this file , rm


## Machine learning model


## Run

1. python >= 3.5 is required
2. install system requirnmets `sudo apt-get install -y python3 python3-dev python-pip3 build-essential flite wmctrl portaudio19-dev libasound-dev`
3. install python packages using pip3

    - pip3 install fuzzyset
    - pip3 install PyAudio
    - pip3 install Flask
    - pip3 install SpeechRecognition
    - pip3 install scikit-learn
    
you can install them at one `pip3 install -r requirnmets.txt`
















