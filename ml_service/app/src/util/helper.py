def is_navratri(dt):

    navratri_dates = {
        "2025-09-22",
        "2025-09-23",
        "2025-09-24",
        "2025-09-25",
        "2025-09-26",
        "2025-09-27",
        "2025-09-28",
        "2025-09-29",
        "2025-09-30",
    }

    return int(dt.strftime("%Y-%m-%d") in navratri_dates)


def is_election_period(dt):

    election_ranges = [
        ("2024-05-01", "2024-06-10"),
        ("2027-12-01", "2027-12-20"),
    ]

    current = dt.date()

    for start, end in election_ranges:

        start = datetime.strptime(start, "%Y-%m-%d").date()
        end = datetime.strptime(end, "%Y-%m-%d").date()

        if start <= current <= end:
            return 1

    return 0


def get_rush_label(crowd):

    if crowd < 20:
        return "Very Low"

    elif crowd < 40:
        return "Low"

    elif crowd < 65:
        return "Moderate"

    elif crowd < 82:
        return "High"

    return "Very High"