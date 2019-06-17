# Cooking unit converter

## App flow

3. enter quantity
2. select input unit
4. see directly convertible units
1. choose favored units
5. select stuff to convert to with density conversion

## Features

[x] provides common conversions
[x] Asks for minimum required information
[ ] remembers used conversions and shows them when you are most likely to use them

## Implementation

There are volume measures and mass measures, within each class conversions can happen without knowing what the substance is, but between them, we ned to know the type of thing.

There are also some definite regional quantities, such as US sticks of butter.

Favored units will be saved.
Most often used units should be shown first, then some useful way of searching them is offered, perhaps text search, or tree
For the above 2 there should be categorization info for the units.

Some input units may only be used for a particular stuff, the others will need to specify whether they are volume or mass and later a decision made on whether to ask for the stuff to make a conversion.

# Unit and substance selection

The main thing to make it useful is to allow a lot of conversion options but to have it on average very quick to find the one you need by showing the most likely ones first.

There are 3 and a half inputs, (quantity, input units, substance type (optional), and output unit (results can be shown in several output units without selecting anything, with a list to find more options))

## Quantity

Changing the quantity shouldn't change the other selections, but it could change the suggested units - 190 is likely to be grams or ml and not kg or liters.

## input unit 

When input unit is changed, the stuff selection is most likely not valid, and so that goes back to unspecified and the most likely stuffs are shown for the input unit.

## Stuff

When the stuff is changed, the output units update to show the most likely units for it.

## Output unit

The output units shown will be based on the stuff chosen. If the user selects an output type then we add the mappings of input unit to stuff and stuff to output unit (input unit to output unit if stuff is not specified).