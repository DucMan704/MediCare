import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load data
data = pd.read_csv("data.csv")

X = data.iloc[:, :-1]
y = data["Outcome"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=10
)

model = RandomForestClassifier(n_estimators=20)
model.fit(X_train, y_train)

print("Accuracy:", accuracy_score(y_test, model.predict(X_test)) * 100)

pickle.dump(model, open("diabetes.pkl", "wb"))
print("Đã lưu diabetes.pkl mới")