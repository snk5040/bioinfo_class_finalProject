#!/usr/local/bin/python3
#For Local Use: !/usr/bin/env python3

import sys
import re
import mysql.connector

def main():

    # Code parses the flybase derived text file into an array
    index=1
    data=[]
    with open("FB_SimpleData.txt") as file:
        for line in file:
            if '#' not in line:
                line = re.sub('\n','',line)
                split_line=re.split('\t',line)
                split_line.insert(0,index)
                index+=1
                data.append(split_line)
                #DEBUG: print(split_line)
    file.close()
    #print(data[:5]) #DEBUG
    #for entry in data:
        #print(entry[0],entry[1],entry[2],entry[3],entry[4],entry[5],entry[6])
        #print(type(entry[0]),type(entry[1]))


    # Code uses mysql connector to build mySQL database on the class server from array
    conn = mysql.connector.connect(user='skyllma1', password='password2', host='localhost', database='skyllma1')
    curs = conn.cursor()
    build_table = """
        INSERT INTO odorbase (ind, FBid, feature_type, name, symbol, uniprot_function, protein_family)
             VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    for entry in data:
        curs.execute(build_table,(entry[0],entry[1],entry[2],entry[3],entry[4],entry[5],entry[6]))
        #print(entry) #DEBUG

    conn.commit()
    print('finished build') #DEBUG

    # Close database resources
    curs.close()
    conn.close()

    '''
    #DEBUG check that mysql connector fetched data
    verification_qry = """
        SELECT * FROM odorbase WHERE FBid=%s
    """

    conn2 = mysql.connector.connect(user='skyllma1', password='password2', host='localhost', database='skyllma1')
    curs2 = conn.cursor()
    curs2.execute(verification_qry,('FBgn0261549'))
    for (ind, FBid, feature_type, name, symbol, uniprot_function, protein_family) in curs2:
        print(“{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}”.format(ind, FBid, feature_type, name, symbol, uniprot_function, protein_family))

    # Close database resources
    curs2.close()
    conn2.close()
    '''

if __name__ == '__main__':
    main()
