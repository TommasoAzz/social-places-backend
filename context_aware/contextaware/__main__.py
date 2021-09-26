#!/usr/bin/env python3

from flask import Flask, request, jsonify
import datetime
import pandas as pd
import model_utility
from model_utility import model
app = Flask(__name__)


# Same name of POI in firebase
category = ["leisure","restaurant","sport"]

@app.route("/recommendation/places", methods=["GET"])
def recommend_places():
    """
    Returns the recommended places (points of interest) to visit at the given parameters found as arguments.
    """

    # if model == None:
    #     model_utility.load_model()
    #     print(model)

    human_activity = request.args.get('ha')
    date_string = request.args.get('date')
    #REPLACE '+' WITH %2b before the req
    date = datetime.datetime.strptime(date_string,'%Y-%m-%d %H:%M:%S%z')
    

    time_of_day = (date.hour * 3600) + (date.minute * 60) + date.second
    # 0 = Monday, 6 = Sunday
    day_of_week = date.weekday()
    # time_of_day,day_of_week,har
    model_request = pd.DataFrame(columns=["time_of_day","day_of_week","har"])
    model_request.loc[0] = [time_of_day,day_of_week,human_activity]
    
    activity_pred = model.predict(model_request)
    list_res = activity_pred.tolist()
    json_res = {}
    json_res["category_response"] = category[list_res[0]]
    return json_res


# @app.route("/recommendation/validity", methods="POST")
# def other():
#     """
#     Returns whether the user should perform or not certain activities given a possible activity.
#     """
#     pass


# @app.route("/recommendation/train", methods=["POST"])
# def train_again_model():
#     """
#     Train again model.
#     """
#     pass

if __name__ == "__main__":
    app.run("0.0.0.0", 4000)