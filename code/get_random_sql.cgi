#!/usr/local/bin/python3

#For network use:!/usr/local/bin/python3
#For local use:!/usr/bin/env python3

import cgi, json
import os
import mysql.connector
import random

# Odorbase is a 128 entry, 6 column SQL table on the class server with flybase genes related to olfaction
# This script pulls a random entry from the database and dumps the data in JSON format

def main():

    print("Content-Type: application/json\n\n")

    conn = mysql.connector.connect(user='skyllma1', password='password2', host='localhost', database='skyllma1')
    curs = conn.cursor()

    qry = """
            SELECT FBid, feature_type, name, symbol, uniprot_function, protein_family FROM odorbase
            WHERE ind = %s
    """
    random_index = random.randrange(0,129)
    curs.execute(qry, (random_index, ))
    results = dict()
    for (FBid, feature_type, name, symbol, uniprot_function, protein_family) in curs:
        results = {"FlyBaseID": FBid, "Feature Type":feature_type, "Name":name, "Symbol":symbol, "UniProt Function":uniprot_function, "Protein Family":protein_family}

    conn.close()

    print(json.dumps(results))


if __name__ == '__main__':
    main()
