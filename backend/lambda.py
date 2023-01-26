import uuid

import boto3

dynamo = boto3.resource("dynamodb")
bins = dynamo.Table("bin")


def get(body, context):
    return bins.scan()["Items"], 200


def post(body, context):
    bin_id = uuid.uuid4().hex
    item = {
        "id": bin_id,
        "latitude": body["lat"],
        "longitude": body["lng"],
        "label": body["label"],
        "type": body["type"],
    }
    bins.put_item(Item=item)
    return get(body, context), 201


REQUESTS = {
    "GET": get,
    "POST": post,
}


def lambda_handler(event, context):
    method = event["httpMethod"]
    body = event["body"]
    items, code = REQUESTS.get(method, "GET")(body, context)

    return {
        "statusCode": code,
        "body": {
            "length": len(items),
            "items": items,
        },
    }
