

# Plan: Add Low-Confidence Tasks for Expert Review Queue

## Objective
Update 6 tasks (1 per industry) to have confidence scores below 80%, ensuring the "Expert Review" queue is regularly populated during demos.

## Current State
- 29 out of 30 tasks have confidence >= 80% (auto-sent)
- Only 1 task (`grocery-2` at 78%) goes to Expert Review
- This makes the Expert Review queue appear empty most of the time

## Proposed Changes

Select 6 tasks randomly across industries and lower their confidence scores to 65-78%:

| Industry | Task ID | Current Confidence | New Confidence |
|----------|---------|-------------------|----------------|
| Retail & eCommerce | `retail-3` | 88% | 72% |
| Grocery & Mass Merch | `grocery-2` | 78% | 68% (already low, adjust lower) |
| CPG & Consumer Brands | `cpg-4` | 89% | 75% |
| Hospitality & Restaurants | `hospitality-1` | 92% | 71% |
| Fashion & Shoes | `fashion-5` | 81% | 74% |
| Media & Entertainment | `media-3` | 88% | 76% |

## File Changes

### 1. `src/data/industries/retailEcommerce.ts`
- Find `task3` definition
- Change `confidence: 88` to `confidence: 72`

### 2. `src/data/industries/groceryMassMerch.ts`
- Find `task2` definition
- Change `confidence: 78` to `confidence: 68`

### 3. `src/data/industries/cpgConsumerBrands.ts`
- Find `task4` definition
- Change `confidence: 89` to `confidence: 75`

### 4. `src/data/industries/hospitalityRestaurants.ts`
- Find `task1` definition
- Change `confidence: 92` to `confidence: 71`

### 5. `src/data/industries/fashionShoes.ts`
- Find `task5` definition
- Change `confidence: 81` to `confidence: 74`

### 6. `src/data/industries/mediaEntertainment.ts`
- Find `task3` definition
- Change `confidence: 88` to `confidence: 76`

## Expected Result

After this change:
- **6 tasks** will have confidence < 80% (go to Expert Review)
- **24 tasks** will have confidence >= 80% (auto-sent)
- The Expert Review queue will be consistently populated during demos
- Provides a 20% review rate which feels realistic for a production system

