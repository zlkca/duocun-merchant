# Duocun-Merchant

Duocun-Merchant is a food delivery merchant website

# Dependencies

Nodejs 
Mongodb

# Install

git clone project

cd to project root folder /, (remove package-lock.json), then run `npm install` for server


# Run

cd to /client and run `ng serve --port 5001`


### Generate language template
cd to /, then run `ng xi18n --output-path locale` and under the locale folder you will see messages.xlf, use your merge tools merge the differences to messages-zh-Hans.xlf, and add <target> to your new items to be translate.

#### Run locale version
run `ng serve --port 5001 --configuration=zh-Hans`

#### Build production locale version
run `ng build --i18n-file src/locale/messages.zh-Hans.xlf --i18n-format xlf --i18n-locale zh-Hans --prod --deploy-url=/partner/ --base-href=/partner/`


