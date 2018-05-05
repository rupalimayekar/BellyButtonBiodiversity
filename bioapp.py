#################################################
# Belly Button Biodiversity Flask App
#################################################

import datetime as dt
# import numpy as np
import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

# from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///data/belly_button_biodiversity.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Assign each table class to a variable
otu = Base.classes.otu
samples = Base.classes.samples
samples_metadata = Base.classes.samples_metadata

# Create a session
session = Session(engine)

# load the otu table into a dataframe
query_statement = session.query(otu).order_by(otu.otu_id).statement
otu_df = pd.read_sql_query(query_statement, session.bind)

# load the samples table into a dataframe
query_statement = session.query(samples).order_by(samples.otu_id).statement
samples_df = pd.read_sql_query(query_statement, session.bind)

# load the samples_metadata table into a dataframe
query_statement = session.query(samples_metadata).order_by(samples_metadata.SAMPLEID).statement
samples_meta_df = pd.read_sql_query(query_statement, session.bind)

# The root route that renders index.html template which is the dashboard page
@app.route("/")
def home():
    samples = samples_df.columns.tolist()[1:]
    return render_template("index.html", sampleNames=samples)

# The handler for the "/names" route. returns a list of sample names/ids
@app.route("/names")
def showSampleNames():
    return jsonify(samples_df.columns.tolist()[1:])

# The handler for the "/otu" route. Returns a list of otu descriptions
@app.route("/otu")
def showOtuDescriptions():
    return jsonify(otu_df['lowest_taxonomic_unit_found'].tolist())

# The handler for the "/metadata/<sample>" route. Displays "Invalid sample id" if the 
# sample given is invalid otherwise returns the json dictionaty of metadata for the given sample
@app.route('/metadata/<sample>')
def showMetadata(sample):
    meta_dict = "Invalid sample id"

    # There is one column in the samples_df for each sampleid in the samples_meta_df
    # If the string exists in the columns list then it is a valid input
    if sample in samples_df.columns.tolist()[1:]:

        id = int(sample.split("_")[1])

        # data type int64 is not json serializable so we have to convert those
        # three int64 values into int
        meta_dict = samples_meta_df[samples_meta_df['SAMPLEID']==id].iloc[0].to_dict()
        meta_dict["AGE"] = meta_dict["AGE"].item()
        meta_dict["SAMPLEID"] = meta_dict["SAMPLEID"].item()
        meta_dict["IMPSURFACE013"] = meta_dict["IMPSURFACE013"].item()

    return jsonify(meta_dict)
    
# The handler for the '/wfreq/<sample>' route. Returns the wash frequency for the given sample
# if it is valid or else an Invalid sample id msg
@app.route('/wfreq/<sample>')
def showWashingFreq(sample):
    wash_freq = "Invalid sample id"

    # There is one column in the samples_df for each sampleid in the samples_meta_df
    # If the string exists in the columns list then it is a valid input
    if sample in samples_df.columns.tolist()[1:]:
        id = int(sample.split("_")[1])

        wash_freq = samples_meta_df[samples_meta_df['SAMPLEID']==id].iloc[0,5]

    return jsonify(wash_freq)

# The handler for the '/samples/<sample>' route. Returns "Invalud Sample id" if the sample is
# not correct, otherwise returns the sample data, otu_ids and descriptions
@app.route('/samples/<sample>')
def showSample(sample):
    data = "Invalid sample id"

    # There is one column in the samples_df for each sampleid in the samples_meta_df
    # If the string exists in the columns list then it is a valid input
    if sample in samples_df.columns.tolist()[1:]:
        data = {}

        # We sort the samples_df in descending order by the sample value passed in the route
        # Then we return a dict with the list of otu_ids and the column which is the sample passed in 
        df = samples_df[["otu_id", sample]].sort_values(sample, ascending=False)
        merged_df = pd.merge(df, otu_df, on="otu_id")

        data["otu_ids"] = merged_df["otu_id"].tolist()
        data[sample] = merged_df[sample].tolist()
        data["otu_description"] = merged_df["lowest_taxonomic_unit_found"].tolist()

    return jsonify(data)


#################################################
# Run the Flask app in Debug mode
#################################################
if __name__ == "__main__":
    #app.run(debug=True)
    app.run()
