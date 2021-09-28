#!/usr/bin/env python3
from __future__ import annotations
# from contextaware.classifier.classifier import ActivityClassifier
from classifier.classifier import ActivityClassifier
from flask import Flask, request, jsonify
from datetime import datetime
import pandas as pd

app = Flask(__name__)
classifier: ActivityClassifier = ActivityClassifier()

@app.route("/recommendation/testmodel", methods=["GET"])
def test_model():
    test_result = classifier.test_model()
    
    print("RESULT ",type(test_result))

    return jsonify(test_result)

@app.route("/", methods=["GET"])
def home():
    print("HOMEEEEEEEEEEEEEEE")
    return "home"

@app.route("/recommendation/places", methods=["GET"])
def recommend_places():
    """
    Returns the recommended places (points of interest) to visit at the given parameters found as arguments.
    """
    # Arguments
    print("IN PREDICT")
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    human_activity = request.args.get('human_activity')
    date_time = request.args.get('date_time')

    # Arguments preprocessing
    #REPLACE '+' WITH %2b before the req
    date_time = datetime.strptime(date_time, '%Y-%m-%d %H:%M:%S%z')
    seconds = (date_time.hour * 3600) + (date_time.minute * 60) + date_time.second
    # 0 = Monday, 6 = Sunday
    day_of_week = date_time.weekday()
    
    # New record creation
    # new_record = pd.DataFrame(columns=["latitude", "longitude", "time_of_day", "day_of_week", "human_activity"])
    new_record = pd.DataFrame(columns=['place_lat', 'place_lon', 'time_of_day', 'day_of_week', 'har_bike',
       'har_bus', 'har_car', 'har_still', 'har_walk'])
    
    har_bike = "bike" == human_activity
    har_bus = "bus" == human_activity
    har_car = "car" == human_activity
    har_still = "still" == human_activity
    har_walk = "walk" == human_activity

    new_record.loc[0] = [latitude, longitude, seconds, day_of_week, har_bike, har_bus, har_car, har_still, har_walk]
    
    # Prediction
    predicted_activity = classifier.predict(new_record)
    json_res = {
        "category_response": predicted_activity
    }
    return json_res


# @app.route("/recommendation/validity", methods="POST")
# def other():
#     """
#     Returns whether the user should perform or not certain activities given a possible activity.
#     """
#     pass


@app.route("/recommendation/train", methods=["POST"])
def train_again_model():
    """
    Train again model given the same data method recommend_places would receive plus the
    expected output.
    """
    # Arguments
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    human_activity = request.args.get('human_activity')
    date_time = request.args.get('date_time')
    place_category = request.args.get('place_category')

    # Arguments preprocessing
    #REPLACE '+' WITH %2b before the req
    date_time = datetime.strptime(date_time, '%Y-%m-%d %H:%M:%S%z')
    seconds = (date_time.hour * 3600) + (date_time.minute * 60) + date_time.second
    # 0 = Monday, 6 = Sunday
    day_of_week = date_time.weekday()
    
    # New record creation
    new_record = pd.DataFrame(columns=['place_lat', 'place_lon','place_category', 'time_of_day', 'day_of_week', 'human_activity'])

    new_record.loc[0] = [latitude, longitude, place_category,seconds, day_of_week, human_activity]

    classifier.update_retrain(new_record)
    
    return "retrained"
    

if __name__ == "__main__":
    print("RUNNING SERVER")
    app.run(host='localhost', port=4000)