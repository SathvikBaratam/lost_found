# Campus Connect - High-Level Design Diagram

```mermaid
flowchart TD
    User[Campus User]

    subgraph Frontend["React + Vite Frontend"]
        App[App.jsx]
        Login[Login Component]
        LostFound[LostFound Page]
        SearchFilter[Search + Filter Bar]
        ItemGrid[Item Grid / Item Detail]
        ItemForm[Report Item Form]
        MyReports[My Reports]
        MatchSuggestions[Match Suggestions]
        ClaimModal[Claim Modal]
        Notifications[Notifications]
        Matching[Local Fuzzy Matching Utility]
    end

    subgraph Firebase["Firebase Backend"]
        Auth[Firebase Auth]
        Firestore[(Cloud Firestore)]
        Storage[(Firebase Storage)]
        Analytics[Firebase Analytics]
    end

    User --> App
    App --> Auth
    App --> Login
    App --> LostFound

    Login --> Auth

    LostFound --> SearchFilter
    LostFound --> ItemGrid
    LostFound --> ItemForm
    LostFound --> MyReports
    LostFound --> MatchSuggestions
    LostFound --> ClaimModal
    LostFound --> Notifications

    SearchFilter --> Matching
    MatchSuggestions --> Matching

    LostFound --> Firestore
    ItemForm --> Firestore
    ClaimModal --> Firestore
    MyReports --> Firestore
    Notifications --> Firestore

    ItemForm -. optional / existing component .-> Storage
    App --> Analytics
```

## Notes

The app is a React + Vite frontend backed by Firebase services. Authentication is handled by Firebase Auth. Lost and found item data is stored in Cloud Firestore. The UI performs search, filtering, and match suggestions locally using the fuzzy matching utility.
