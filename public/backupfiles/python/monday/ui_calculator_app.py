#!/usr/bin/env python3
"""
Standalone UI Calculator
A Flask app serving the interactive UI calculator
"""

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    """Serve the UI calculator directly."""
    return render_template('ui_calculator_standalone.html')

@app.route('/ui_calculator')
def ui_calculator():
    """Alternative route for the UI calculator."""
    return render_template('ui_calculator_standalone.html')

if __name__ == '__main__':
    print("=== UI Calculator Server ===")
    print("Access the calculator at:")
    print("http://localhost:5002")
    print("============================")
    
    app.run(debug=True, host='0.0.0.0', port=5002)
