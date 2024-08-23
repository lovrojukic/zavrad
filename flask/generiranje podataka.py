import pandas as pd
import numpy as np

np.random.seed(42)  


num_samples = 1000


products = [
    'Vijak', 'Uredski Stol', 'Školska Stolica', 'Stol za Vrtić', 'Čavao',
    'Oglasna Ploča', 'Ormarić za Dokumente', 'Polica za Knjige', 'Organizator za Stol',
    'Spajalice za Papir', 'Klamerica', 'Markeri', 'Bijela Ploča', 'Projektor',
    'Koš za Smeće', 'Aparat za Vodu', 'Stalak za Laptop', 'Povišenje za Monitor',
    'Držač za Olovke', 'Podložak za Stol', 'Pladanj za Dokumente'
]

# Generiranje podataka
data = {
    'Product': np.random.choice(products, num_samples),
    'Monthly Demand': np.random.randint(10, 1001, size=num_samples),  
    'Lead Time (Days)': np.random.randint(1, 30, size=num_samples)    
}

df = pd.DataFrame(data)


df['Reorder Level'] = (df['Monthly Demand'] + df['Monthly Demand']*df['Lead Time (Days)']/30).astype(int)

# Spremanje podataka u CSV datoteku
df.to_csv('6.csv', index=False)



