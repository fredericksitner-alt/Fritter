# ElementalScience account-gated prototype

This version includes:

- Public landing page only
- Hero and mission sections
- Scroll-driven gated ion-channel animation
- Na+, K+, Cl−, and Ca2+ ions
- Account panel revealed after the channel opens
- Google Sign-In and email/password account UI
- Firebase Authentication integration
- Demo mode before Firebase is configured
- Biology, Chemistry, Physics, lesson, and dashboard pages protected behind sign-in
- Signed-in profile dropdown and sign-out

## Test immediately

Run a local server from this folder:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

Until Firebase is configured, Google and email buttons use demo mode so you can preview the complete flow.

## Enable real Google Sign-In

1. Create a Firebase project.
2. Go to Authentication → Sign-in method.
3. Enable Google.
4. Enable Email/Password.
5. Create a Firebase Web App under Project settings.
6. Paste its configuration into `firebase-config.js`.
7. Add your deployed domain under Authentication → Settings → Authorized domains.

Do not place private server credentials in these files. The Firebase web configuration is designed to be public; access control comes from Firebase Authentication and security rules.


## Version 2 adjustments
- Restored labeled A–T and C–G DNA base pairs
- Header fades away as the mission section enters
- Faster, eased ion-channel opening
- Expanded ion field
- Multiple ions now travel through the center of the channel pore


## Version 3 adjustments
- DNA base pairs are now label-free and use two gold shades
- Base pairs are inset so they stay inside the double helix
- Channel-section heading moved upward to avoid overlap with ions and membrane animation


## Version 4 adjustments
- Moved the channel heading higher so ions no longer cover it
- Changed the sticky section to use the full viewport so the account card is not cut off
- Compacted the account form for better vertical fit
- Placed the subject-unlock text inside a dark blue box with gold text and border
- Moved the benefits panel away from the center channel animation


## Version 5 adjustments
- Removed the sentence below the channel heading
- Moved the remaining heading slightly higher
- Matched the blue benefits panel to the white account panel in width and height


## Version 6 adjustments
- Moved both account panels higher
- Increased both panels slightly while keeping them identical in size
- Added responsive height limits to prevent the white panel from being cut off
- Kept the form content contained inside the white panel


## Version 7 adjustments
- Removed the entire blue benefits panel
- Expanded the white authentication card to fill nearly the whole screen
- Increased the card width and height
- Reorganized the form into two columns on desktop for better use of space
- Kept a single-column mobile layout


## Version 8 adjustments
- Moved upper ions away from the lipid bilayer
- Reduced the channel section scroll distance
- Made the channel open and reveal the account card sooner
- Softened the protein movement for a lighter feel


## Version 9 adjustments
- Moved the large white heading higher so it is no longer covered by floating ions


## Version 10 adjustments
- Removed the negative heading offset that caused clipping
- Added top breathing room inside the channel section
- Moved upper ions lower and away from the center headline area


## Version 11 adjustments
- Moved the remaining upper ions higher so they no longer float over the lipid bilayer
- Removed the downward offset on top ions and replaced it with a slight upward offset
