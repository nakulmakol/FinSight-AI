from nselib import capital_market

df = capital_market.price_volume_data(
    symbol="TCS",
    period="1D"
)

print(df)