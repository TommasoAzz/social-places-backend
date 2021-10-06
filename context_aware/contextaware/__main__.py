#!/usr/bin/env python3
from __future__ import annotations

from contextaware.classifier.classifier import ActivityClassifier
from flask import Flask, request
import pandas as pd

app = Flask(__name__)
classifier = ActivityClassifier()

def create_record(req: request) -> pd.DataFrame:
    latitude = req.args.get('latitude')
    longitude = req.args.get('longitude')
    human_activity = req.args.get('human_activity')
    seconds_in_day = req.args.get('seconds_in_day')
    week_day = req.args.get('week_day')
    
    # New record creation
    new_record = pd.DataFrame(columns=[
        'place_lat', 'place_lon', 'time_of_day', 'day_of_week', 'human_activity_bike',
        'human_activity_bus', 'human_activity_car', 'human_activity_still', 'human_activity_walk'
        ])
    
    har_bike = "bike" == human_activity
    har_bus = "bus" == human_activity
    har_car = "car" == human_activity
    har_still = "still" == human_activity
    har_walk = "walk" == human_activity

    new_record.loc[0] = [latitude, longitude, seconds_in_day, week_day, har_bike, har_bus, har_car, har_still, har_walk]
    return new_record
    


@app.route("/recommendation/accuracy", methods=["GET"])
def compute_model_accuracy():
    """
    Returns the current accuracy of the model.
    """
    test_result = classifier.test_model()

    return test_result, 200


@app.route("/recommendation/places", methods=["GET"])
def recommend_place_category():
    """
    Returns the recommended places (points of interest) to visit at the given parameters found as arguments.
    """    
    # Create new record from request
    new_record = create_record(request)

    # Prediction
    predicted_place_cat = classifier.predict(new_record)
    response = {
        "place_category": predicted_place_cat
    }
    return response, 200


@app.route("/recommendation/validity", methods=["GET"])
def should_advise_place_category():
    """
    Returns whether the user should perform or not certain activities given a possible activity.
    """
     # Create new record from request
    new_record = create_record(request)
    place_category = request.args.get('place_category')

    # Prediction
    predicted_place_cat = classifier.predict(new_record)
    result = place_category == predicted_place_cat
    return result, 200


@app.route("/recommendation/train", methods=["POST"])
def train_again_model():
    """
    Train again the model, given the same data the method recommend_places would receive, plus the
    expected output. Returns the new accuracy.
    """
    # Arguments
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    human_activity = request.args.get('human_activity')
    seconds_in_day = request.args.get('seconds_in_day')
    week_day = request.args.get('week_day')
    place_category = request.args.get('place_category')
    
    # New record creation
    new_record = pd.DataFrame(columns=[
        'place_lat', 'place_lon','place_category', 'time_of_day', 'day_of_week', 'human_activity'
        ])

    new_record.loc[0] = [latitude, longitude, place_category, seconds_in_day, week_day, human_activity]

    classifier.update_retrain(new_record)

    test_result = classifier.test_model()

    return test_result, 200
    

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4000)