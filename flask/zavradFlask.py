from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)


model = joblib.load('bezdem.joblib')


X_train = pd.read_csv('6.csv')  
X_train = pd.get_dummies(X_train.drop('Reorder Level', axis=1))

@app.route('/check_reorder', methods=['POST'])
def check_reorder():
    data = request.json
    print("Primljeni podaci:", data)
    product_data = {
        'Product': data.get('product'),
        'Monthly Demand': data.get('monthly_demand'),
        'Current Stock': data.get('current_stock'),
        'Lead Time (Days)': data.get('lead_time')
    }
    
    
    new_data = pd.DataFrame([product_data])
    new_data = pd.get_dummies(new_data)

    
    missing_cols = set(X_train.columns) - set(new_data.columns)
    for c in missing_cols:
        new_data[c] = 0
    new_data = new_data[X_train.columns]

    
    reorder_level = model.predict(new_data)[0]
    print("Predviđeni reorder level:", reorder_level)
    if product_data['Current Stock'] < reorder_level:
        return jsonify({'reorder': True, 'reorder_level': reorder_level})
    else:
        return jsonify({'reorder': False, 'reorder_level': reorder_level})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
