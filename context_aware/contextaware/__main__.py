#!/usr/bin/env python3

from context_aware.contextaware.classifier.classifier import ActivityClassifier
from flask import Flask, request
from datetime import datetime
from __future__ import annotations
import pandas as pd

app = Flask(__name__)
classifier: ActivityClassifier = ActivityClassifier.get_instance()

@app.route("/recommendation/places", methods=["GET"])
def recommend_places():
    """
    Returns the recommended places (points of interest) to visit at the given parameters found as arguments.
    """
    # Arguments
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
    new_record = pd.DataFrame(columns=["latitude", "longitude", "time_of_day", "day_of_week", "human_activity"])
    new_record.loc[0] = [latitude, longitude, seconds, day_of_week, human_activity]
    
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
    new_record = pd.DataFrame(columns=["latitude", "longitude", "time_of_day", "day_of_week", "human_activity", "place_category"])
    new_record.loc[0] = [latitude, longitude, seconds, day_of_week, human_activity, place_category]

    classifier.update_retrain(new_record)
    return None
    

if __name__ == "__main__":
    app.run("0.0.0.0", 4000)