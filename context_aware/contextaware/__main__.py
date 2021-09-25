#!/usr/bin/env python3

from flask import Flask

app = Flask(__name__)

@app.route("/recommendation/places", methods=["GET"])
def recommend_places():
    """
    Returns the recommended places (points of interest) to visit at the given parameters found as arguments.
    """
    pass


@app.route("/recommendation/validity", methods="POST")
def other():
    """
    Returns whether the user should perform or not certain activities given a possible activity.
    """
    pass


@app.route("/recommendation/train", methods=["POST"])
def train_again_model():
    """
    Train again model.
    """
    pass

if __name__ == "__main__":
    app.run("0.0.0.0", 4000)