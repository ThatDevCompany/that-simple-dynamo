# That Simple Dynamo
[![CircleCI](https://circleci.com/gh/ThatDevCompany/that-simple-dynamo.svg?style=svg)](https://circleci.com/gh/ThatDevCompany/that-simple-dynamo)

##  Overview
A DynamoDB implementation of an IObjectStore

This allows the persistance if IModels into DynamoDB

See the following projects for more information:-

* [that-simple-model](https://github.com/ThatDevCompany/that-simple-model)
* [that-simple-objectstore](https://github.com/ThatDevCompany/that-simple-objectstore)

### Example

```$typescript

    // Initialise the datastore
    let theObjectStore = new DynamoObjectStore({
        region: process.env.AWS_DEFAULT_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        endpoint: process.env.AWS_ENDPOINT
    })
    
    // Create a new item
    let item = new MyModel()
    item.id = '1234'
    theObjectStore.put(item)
    
    // Read an item	
    item = theObjectStore.get(MyModel, '1234')
    
    // Query all Items
    let items = theObjectStore.query()
	
    // Delete an Item
    theObjectStore.remove(item)
	
```
