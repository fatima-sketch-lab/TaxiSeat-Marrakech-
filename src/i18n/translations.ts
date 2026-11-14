import { Language, BookingStatus, SeatStatus, TaxiType } from '../types';

export interface Translations {
  brandTagline: string;
  welcome: {
    badge: string;
    title: string;
    subtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    continuePassenger: string;
    continueDriver: string;
    continueAdmin: string;
    authTitle: string;
    loginTab: string;
    registerTab: string;
    quickDemoBtn: string;
    fullName: string;
    phone: string;
    email: string;
    password: string;
    signIn: string;
    createAccount: string;
    authErrorMissing: string;
    authErrorInvalid: string;
    demoNote: string;
  };
  roles: {
    passenger: string;
    driver: string;
    admin: string;
  };
  nav: {
    home: string;
    search: string;
    bookings: string;
    history: string;
    profile: string;
    dashboard: string;
    route: string;
    earnings: string;
    overview: string;
    passengers: string;
    drivers: string;
    taxis: string;
    analytics: string;
  };
  common: {
    language: string;
    save: string;
    cancel: string;
    confirm: string;
    back: string;
    close: string;
    edit: string;
    signOut: string;
    loading: string;
    simulatedNotice: string;
    mad: string;
    min: string;
    km: string;
    seats: string;
    seat: string;
    available: string;
    reserved: string;
    occupied: string;
    online: string;
    offline: string;
    notifications: string;
    markAllRead: string;
    noNotifications: string;
    viewAll: string;
    driver: string;
    vehicle: string;
    plate: string;
    rating: string;
    status: string;
    reference: string;
    actions: string;
    searchPlaceholder: string;
    all: string;
    reset: string;
  };
  taxiTypes: Record<TaxiType, string>;
  seatStatus: Record<SeatStatus, string>;
  bookingStatus: Record<BookingStatus, string>;
  passengerHome: {
    title: string;
    subtitle: string;
    fromLabel: string;
    toLabel: string;
    fromPlaceholder: string;
    toPlaceholder: string;
    detectGps: string;
    gpsDetected: string;
    findTaxis: string;
    swapLocations: string;
    popularCorridors: string;
    activeTaxisOnMap: string;
    samePointError: string;
    missingPointError: string;
    activeTripBanner: string;
    trackTrip: string;
    simulateMovement: string;
    pauseSimulation: string;
  };
  search: {
    resultsTitle: string;
    resultsSubtitle: string;
    matchingRuleNote: string;
    sortClosest: string;
    sortCheapest: string;
    sortFastest: string;
    sortComfortable: string;
    filtersTitle: string;
    taxiTypeLabel: string;
    maxPriceLabel: string;
    maxWaitLabel: string;
    minSeatsLabel: string;
    etaAway: string;
    seatsAvailable: string;
    estimatedFare: string;
    journeyDuration: string;
    routeMatch: string;
    selectSeatCta: string;
    noResultsTitle: string;
    noResultsDesc: string;
    modifySearch: string;
    searchingTaxis: string;
  };
  seatSelection: {
    title: string;
    routePreview: string;
    pickupPoint: string;
    destinationPoint: string;
    chooseSeat: string;
    seatLegend: string;
    driverCabin: string;
    selectedSeatLabel: string;
    noSeatSelected: string;
    fareBreakdown: string;
    baseSeatFare: string;
    platformFee: string;
    totalToPay: string;
    continueToPayment: string;
    seatUnavailableError: string;
  };
  payment: {
    title: string;
    subtitle: string;
    summaryTitle: string;
    methodTitle: string;
    methodCard: string;
    methodCardDesc: string;
    methodWallet: string;
    methodWalletDesc: string;
    methodMobile: string;
    methodMobileDesc: string;
    disclaimer: string;
    payNow: string;
    processing: string;
    successTitle: string;
    successDesc: string;
    viewBooking: string;
  };
  bookings: {
    activeTitle: string;
    historyTitle: string;
    noActiveTitle: string;
    noActiveDesc: string;
    findFirstTaxi: string;
    noHistoryTitle: string;
    noHistoryDesc: string;
    driverContact: string;
    callDriver: string;
    messageDriver: string;
    simulatedCallNotice: string;
    cancelBooking: string;
    cancelConfirmText: string;
    journeyCompletedBtn: string;
    arrivalConfirmTitle: string;
    arrivalConfirmDesc: string;
    waitingDriverRelease: string;
    seatReleasedNote: string;
    rateDriverTitle: string;
    rateDriverDesc: string;
    rateCommentPlaceholder: string;
    submitRating: string;
    ratedLabel: string;
    refundedBadge: string;
    paidBadge: string;
    simulateDriverAdvance: string;
  };
  driver: {
    registerTitle: string;
    registerSubtitle: string;
    statusOnline: string;
    statusOffline: string;
    toggleAvailability: string;
    acceptingBookings: string;
    pausedBookings: string;
    currentLocation: string;
    currentDestination: string;
    currentRoute: string;
    availableSeats: string;
    reservedSeats: string;
    activeBookings: string;
    estimatedEarnings: string;
    advanceRouteBtn: string;
    manageRouteTitle: string;
    originLabel: string;
    destinationLabel: string;
    addStopLabel: string;
    startJourney: string;
    endJourney: string;
    updateRoute: string;
    seatControlTitle: string;
    seatControlDesc: string;
    incomingTitle: string;
    noBookingsTitle: string;
    noBookingsDesc: string;
    accept: string;
    reject: string;
    markApproaching: string;
    confirmBoarding: string;
    confirmDeparture: string;
    passengerConfirmedWait: string;
    earningsToday: string;
    earningsWeek: string;
    earningsMonth: string;
    completedRides: string;
    weeklyChartTitle: string;
    recentPayouts: string;
    licenseLabel: string;
    modelLabel: string;
    plateLabel: string;
    capacityLabel: string;
    switchDemoDriver: string;
    updateProfileSuccess: string;
  };
  admin: {
    title: string;
    subtitle: string;
    totalPassengers: string;
    totalDrivers: string;
    activeTaxis: string;
    totalBookings: string;
    completedBookings: string;
    cancelledBookings: string;
    platformRevenue: string;
    bookingsByStatus: string;
    topCorridors: string;
    fleetOccupancy: string;
    completionRate: string;
    cancellationRate: string;
    joinedDate: string;
    tripsCount: string;
    verified: string;
    pending: string;
    occupancy: string;
    corridorDemand: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    brandTagline: 'Transport urbain partagé au Maroc',
    welcome: {
      badge: 'Pilote Marrakech · Mobilité partagée',
      title: 'Réservez votre place dans un taxi déjà en route.',
      subtitle:
        'TaxiSeat connecte les voyageurs aux petits et grands taxis circulant dans leur direction. Comparez les trajets compatibles, choisissez votre siège et payez en ligne.',
      feature1Title: 'Correspondance d’itinéraire',
      feature1Desc: 'Seuls les taxis dont le trajet passe par votre départ et votre destination s’affichent.',
      feature2Title: 'Gestion des places en direct',
      feature2Desc: 'Visualisez les sièges libres dans les petits (3 places) et grands taxis (6 places).',
      feature3Title: 'Paiement & suivi intégrés',
      feature3Desc: 'Tarifs transparents en MAD, suivi de l’approche et confirmation d’arrivée.',
      continuePassenger: 'Espace Passager',
      continueDriver: 'Espace Chauffeur',
      continueAdmin: 'Console Admin',
      authTitle: 'Accès Passager',
      loginTab: 'Connexion',
      registerTab: 'Inscription',
      quickDemoBtn: 'Continuer avec le compte démo (Salma)',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      signIn: 'Se connecter',
      createAccount: 'Créer mon compte',
      authErrorMissing: 'Veuillez remplir tous les champs obligatoires.',
      authErrorInvalid: 'Veuillez saisir un e-mail valide et un mot de passe d’au moins 4 caractères.',
      demoNote: 'Prototype interactif avec données simulées pour Marrakech.',
    },
    roles: {
      passenger: 'Passager',
      driver: 'Chauffeur',
      admin: 'Admin',
    },
    nav: {
      home: 'Accueil',
      search: 'Recherche',
      bookings: 'Mes réservations',
      history: 'Historique',
      profile: 'Profil',
      dashboard: 'Tableau de bord',
      route: 'Mon trajet',
      earnings: 'Revenus',
      overview: 'Vue globale',
      passengers: 'Passagers',
      drivers: 'Chauffeurs',
      taxis: 'Taxis',
      analytics: 'Analyses',
    },
    common: {
      language: 'Langue',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      back: 'Retour',
      close: 'Fermer',
      edit: 'Modifier',
      signOut: 'Déconnexion',
      loading: 'Chargement...',
      simulatedNotice: 'Environnement de démonstration simulé',
      mad: 'MAD',
      min: 'min',
      km: 'km',
      seats: 'places',
      seat: 'place',
      available: 'Disponible',
      reserved: 'Réservé',
      occupied: 'Occupé',
      online: 'En ligne',
      offline: 'Hors ligne',
      notifications: 'Notifications',
      markAllRead: 'Tout marquer lu',
      noNotifications: 'Aucune notification pour le moment.',
      viewAll: 'Tout voir',
      driver: 'Chauffeur',
      vehicle: 'Véhicule',
      plate: 'Matricule',
      rating: 'Note',
      status: 'Statut',
      reference: 'Référence',
      actions: 'Actions',
      searchPlaceholder: 'Rechercher...',
      all: 'Tous',
      reset: 'Réinitialiser',
    },
    taxiTypes: {
      small: 'Petit Taxi',
      large: 'Grand Taxi',
    },
    seatStatus: {
      available: 'Libre',
      reserved: 'Réservée',
      occupied: 'Occupée',
    },
    bookingStatus: {
      pending_confirmation: 'En attente de confirmation',
      confirmed: 'Confirmée',
      driver_approaching: 'Chauffeur en approche',
      picked_up: 'Passager à bord',
      completed: 'Trajet terminé',
      cancelled: 'Annulée',
    },
    passengerHome: {
      title: 'Où allez-vous aujourd’hui ?',
      subtitle: 'Trouvez un taxi partagé déjà orienté vers votre destination à Marrakech.',
      fromLabel: 'Départ (Position actuelle)',
      toLabel: 'Destination souhaitée',
      fromPlaceholder: 'Sélectionner votre point de départ...',
      toPlaceholder: 'Où souhaitez-vous aller ?',
      detectGps: 'Ma position',
      gpsDetected: 'Position détectée : Guéliz (Place du 16 Novembre)',
      findTaxis: 'Trouver des taxis disponibles',
      swapLocations: 'Inverser départ et destination',
      popularCorridors: 'Trajets fréquents à Marrakech',
      activeTaxisOnMap: 'Taxis actifs sur la carte',
      samePointError: 'Le point de départ et la destination doivent être différents.',
      missingPointError: 'Veuillez sélectionner un départ et une destination.',
      activeTripBanner: 'Course en cours',
      trackTrip: 'Suivre le taxi',
      simulateMovement: 'Mouvement en direct',
      pauseSimulation: 'Pause carte',
    },
    search: {
      resultsTitle: 'Taxis compatibles',
      resultsSubtitle: 'Affichant uniquement les taxis dont l’itinéraire couvre votre trajet',
      matchingRuleNote: 'Filtrage strict par direction et arrêts compatibles',
      sortClosest: 'Plus proche',
      sortCheapest: 'Moins cher',
      sortFastest: 'Attente la plus courte',
      sortComfortable: 'Plus confortable',
      filtersTitle: 'Filtres',
      taxiTypeLabel: 'Type de taxi',
      maxPriceLabel: 'Prix max (MAD)',
      maxWaitLabel: 'Attente max (min)',
      minSeatsLabel: 'Places min.',
      etaAway: 'Arrivée dans',
      seatsAvailable: 'places libres',
      estimatedFare: 'Tarif estimé',
      journeyDuration: 'Durée estimée',
      routeMatch: 'Compatibilité trajet',
      selectSeatCta: 'Choisir une place',
      noResultsTitle: 'Aucun taxi compatible trouvé',
      noResultsDesc:
        'Aucun taxi actif ne suit actuellement cet itinéraire avec ces filtres. Essayez d’élargir vos filtres ou testez un corridor populaire.',
      modifySearch: 'Modifier le trajet',
      searchingTaxis: 'Analyse des itinéraires compatibles...',
    },
    seatSelection: {
      title: 'Détails & Choix du siège',
      routePreview: 'Itinéraire du taxi',
      pickupPoint: 'Point de prise en charge',
      destinationPoint: 'Destination passager',
      chooseSeat: 'Sélectionnez votre place',
      seatLegend: 'Légende des places',
      driverCabin: 'Conducteur',
      selectedSeatLabel: 'Place sélectionnée',
      noSeatSelected: 'Touchez une place libre en bleu clair pour la réserver.',
      fareBreakdown: 'Détail du tarif',
      baseSeatFare: 'Tarif de la place',
      platformFee: 'Frais de service',
      totalToPay: 'Total à payer',
      continueToPayment: 'Continuer vers le paiement',
      seatUnavailableError: 'Cette place vient d’être réservée. Veuillez en choisir une autre.',
    },
    payment: {
      title: 'Paiement en ligne sécurisé (Simulé)',
      subtitle: 'Aucune vraie carte bancaire n’est requise ou enregistrée.',
      summaryTitle: 'Récapitulatif de la réservation',
      methodTitle: 'Mode de paiement simulé',
      methodCard: 'Carte bancaire marocaine (CMI Simulé)',
      methodCardDesc: 'Visa / Mastercard · Autorisation instantanée',
      methodWallet: 'Portefeuille TaxiSeat',
      methodWalletDesc: 'Solde démo disponible : 240 MAD',
      methodMobile: 'Paiement Mobile (M-Wallet)',
      methodMobileDesc: 'Validation rapide par téléphone',
      disclaimer: 'Transaction de démonstration : aucun débit réel ne sera effectué.',
      payNow: 'Confirmer et payer',
      processing: 'Validation du paiement...',
      successTitle: 'Paiement confirmé',
      successDesc: 'Votre place est temporairement bloquée en attendant la validation du chauffeur.',
      viewBooking: 'Suivre ma réservation',
    },
    bookings: {
      activeTitle: 'Réservations actives',
      historyTitle: 'Historique des trajets',
      noActiveTitle: 'Aucune réservation active',
      noActiveDesc: 'Recherchez un taxi partagé pour réserver votre prochaine place.',
      findFirstTaxi: 'Rechercher un taxi',
      noHistoryTitle: 'Aucun trajet terminé ou annulé',
      noHistoryDesc: 'Vos courses passées et reçus apparaîtront ici.',
      driverContact: 'Contacter le chauffeur (simulé)',
      callDriver: 'Appeler',
      messageDriver: 'Message',
      simulatedCallNotice: 'Appel simulé lancé vers le chauffeur :',
      cancelBooking: 'Annuler la réservation',
      cancelConfirmText: 'Votre place sera immédiatement libérée et le paiement remboursé.',
      journeyCompletedBtn: 'Trajet terminé — Confirmer l’arrivée',
      arrivalConfirmTitle: 'Confirmer l’arrivée à destination',
      arrivalConfirmDesc:
        'Une fois confirmé, le chauffeur validera votre descente pour libérer la place.',
      waitingDriverRelease: 'Arrivée confirmée par vous · En attente de validation chauffeur pour libérer le siège',
      seatReleasedNote: 'Descente confirmée par le chauffeur · Place libérée',
      rateDriverTitle: 'Évaluer votre trajet',
      rateDriverDesc: 'Comment s’est passé ce trajet partagé ?',
      rateCommentPlaceholder: 'Commentaire optionnel (ponctualité, confort...)',
      submitRating: 'Envoyer la note',
      ratedLabel: 'Note attribuée',
      refundedBadge: 'Remboursé',
      paidBadge: 'Payé',
      simulateDriverAdvance: 'Simuler étape suivante chauffeur',
    },
    driver: {
      registerTitle: 'Profil & Véhicule Chauffeur',
      registerSubtitle: 'Gérez votre licence, type de taxi et capacité passagers.',
      statusOnline: 'En service',
      statusOffline: 'Hors service',
      toggleAvailability: 'Statut de service',
      acceptingBookings: 'Accepte les réservations',
      pausedBookings: 'Réservations en pause',
      currentLocation: 'Position actuelle',
      currentDestination: 'Destination finale',
      currentRoute: 'Itinéraire actif',
      availableSeats: 'Places libres',
      reservedSeats: 'Places réservées / occupées',
      activeBookings: 'Réservations actives',
      estimatedEarnings: 'Revenus du jour',
      advanceRouteBtn: 'Avancer sur l’itinéraire',
      manageRouteTitle: 'Gestion d’itinéraire et capacité',
      originLabel: 'Point de départ',
      destinationLabel: 'Destination du taxi',
      addStopLabel: 'Arrêts intermédiaires',
      startJourney: 'Démarrer la course',
      endJourney: 'Terminer la course',
      updateRoute: 'Mettre à jour l’itinéraire',
      seatControlTitle: 'Gestion manuelle des places',
      seatControlDesc: 'Cliquez sur une place libre/occupée sans réservation en ligne pour ajuster.',
      incomingTitle: 'Demandes & Passagers en cours',
      noBookingsTitle: 'Aucune demande pour ce trajet',
      noBookingsDesc: 'Passez en ligne pour recevoir des réservations compatibles avec votre route.',
      accept: 'Accepter',
      reject: 'Refuser',
      markApproaching: 'En approche',
      confirmBoarding: 'Confirmer montée',
      confirmDeparture: 'Confirmer descente',
      passengerConfirmedWait: 'Le passager a signalé son arrivée. Confirmez la descente pour libérer le siège.',
      earningsToday: 'Aujourd’hui',
      earningsWeek: 'Cette semaine',
      earningsMonth: 'Ce mois',
      completedRides: 'Courses effectuées',
      weeklyChartTitle: 'Revenus des 7 derniers jours (MAD)',
      recentPayouts: 'Historique financier récent',
      licenseLabel: 'Numéro de permis / Agrément',
      modelLabel: 'Modèle du véhicule',
      plateLabel: 'Immatriculation',
      capacityLabel: 'Capacité passagers',
      switchDemoDriver: 'Changer de chauffeur démo',
      updateProfileSuccess: 'Informations du chauffeur mises à jour.',
    },
    admin: {
      title: 'Administration TaxiSeat',
      subtitle: 'Supervision de la flotte, des utilisateurs et de l’activité à Marrakech',
      totalPassengers: 'Passagers inscrits',
      totalDrivers: 'Chauffeurs inscrits',
      activeTaxis: 'Taxis actifs',
      totalBookings: 'Total réservations',
      completedBookings: 'Trajets terminés',
      cancelledBookings: 'Annulations',
      platformRevenue: 'Revenus estimés',
      bookingsByStatus: 'Répartition des réservations par statut',
      topCorridors: 'Corridors les plus demandés',
      fleetOccupancy: 'Taux d’occupation de la flotte',
      completionRate: 'Taux de réussite',
      cancellationRate: 'Taux d’annulation',
      joinedDate: 'Inscription',
      tripsCount: 'Trajets',
      verified: 'Vérifié',
      pending: 'En attente',
      occupancy: 'Occupation',
      corridorDemand: 'Demande estimée',
    },
  },
  ar: {
    brandTagline: 'النقل الحضري المشترك في المغرب',
    welcome: {
      badge: 'تجربة مراكش · تنقل مشترك ذكي',
      title: 'احجز مقعدك في سيارة أجرة متجهة نحو وجهتك.',
      subtitle:
        'يربط TaxiSeat المسافرين بسيارات الأجرة الصغيرة والكبيرة التي تسير بالفعل في نفس الاتجاه. قارن المسارات المتوافقة، اختر مقعدك وادفع عبر الإنترنت.',
      feature1Title: 'مطابقة ذكية للمسار',
      feature1Desc: 'لا تظهر إلا سيارات الأجرة التي يمر مسارها بنقطة انطلاقك ووصولك.',
      feature2Title: 'مراقبة المقاعد مباشرة',
      feature2Desc: 'شاهد المقاعد المتاحة في سيارات الأجرة الصغيرة (3 مقاعد) والكبيرة (6 مقاعد).',
      feature3Title: 'دفع وتتبع متكامل',
      feature3Desc: 'أسعار واضحة بالدرهم، تتبع الاقتراب وتأكيد الوصول.',
      continuePassenger: 'واجهة المسافر',
      continueDriver: 'واجهة السائق',
      continueAdmin: 'لوحة الإدارة',
      authTitle: 'حساب المسافر',
      loginTab: 'تسجيل الدخول',
      registerTab: 'إنشاء حساب',
      quickDemoBtn: 'المتابعة بالحساب التجريبي (سلمى)',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signIn: 'دخول',
      createAccount: 'إنشاء الحساب',
      authErrorMissing: 'يرجى ملء جميع الحقول المطلوبة.',
      authErrorInvalid: 'يرجى إدخال بريد إلكتروني صحيح وكلمة مرور من 4 أحرف على الأقل.',
      demoNote: 'نموذج تفاعلي ببيانات محاكاة لمدينة مراكش.',
    },
    roles: {
      passenger: 'مسافر',
      driver: 'سائق',
      admin: 'الإدارة',
    },
    nav: {
      home: 'الرئيسية',
      search: 'بحث',
      bookings: 'حجوزاتي',
      history: 'السجل',
      profile: 'الحساب',
      dashboard: 'لوحة التحكم',
      route: 'مساري',
      earnings: 'الأرباح',
      overview: 'نظرة عامة',
      passengers: 'المسافرون',
      drivers: 'السائقون',
      taxis: 'سيارات الأجرة',
      analytics: 'التحليلات',
    },
    common: {
      language: 'اللغة',
      save: 'حفظ',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      back: 'رجوع',
      close: 'إغلاق',
      edit: 'تعديل',
      signOut: 'تسجيل الخروج',
      loading: 'جاري التحميل...',
      simulatedNotice: 'بيئة تجريبية محاكاة',
      mad: 'درهم',
      min: 'دقيقة',
      km: 'كم',
      seats: 'مقاعد',
      seat: 'مقعد',
      available: 'متاح',
      reserved: 'محجوز',
      occupied: 'مشغول',
      online: 'متصل',
      offline: 'غير متصل',
      notifications: 'الإشعارات',
      markAllRead: 'تحديد الكل كمقروء',
      noNotifications: 'لا توجد إشعارات حالياً.',
      viewAll: 'عرض الكل',
      driver: 'السائق',
      vehicle: 'المركبة',
      plate: 'لوحة الترقيم',
      rating: 'التقييم',
      status: 'الحالة',
      reference: 'المرجع',
      actions: 'إجراءات',
      searchPlaceholder: 'بحث...',
      all: 'الكل',
      reset: 'إعادة ضبط',
    },
    taxiTypes: {
      small: 'طاكسي صغير',
      large: 'طاكسي كبير',
    },
    seatStatus: {
      available: 'متاح',
      reserved: 'محجوز',
      occupied: 'مشغول',
    },
    bookingStatus: {
      pending_confirmation: 'في انتظار التأكيد',
      confirmed: 'تم التأكيد',
      driver_approaching: 'السائق في الطريق',
      picked_up: 'تم الركوب',
      completed: 'اكتملت الرحلة',
      cancelled: 'ملغاة',
    },
    passengerHome: {
      title: 'إلى أين تتجه اليوم؟',
      subtitle: 'ابحث عن سيارة أجرة مشتركة متجهة بالفعل إلى وجهتك في مراكش.',
      fromLabel: 'نقطة الانطلاق (موقعك الحالي)',
      toLabel: 'الوجهة المطلوبة',
      fromPlaceholder: 'اختر نقطة الانطلاق...',
      toPlaceholder: 'إلى أين تريد الذهاب؟',
      detectGps: 'موقعي',
      gpsDetected: 'تم تحديد الموقع: جليز (ساحة 16 نونبر)',
      findTaxis: 'البحث عن سيارات الأجرة المتاحة',
      swapLocations: 'تبديل الانطلاق والوجهة',
      popularCorridors: 'مسارات شائعة في مراكش',
      activeTaxisOnMap: 'سيارات الأجرة النشطة على الخريطة',
      samePointError: 'يجب أن تكون نقطة الانطلاق والوجهة مختلفتين.',
      missingPointError: 'يرجى تحديد نقطة الانطلاق والوجهة.',
      activeTripBanner: 'رحلة جارية',
      trackTrip: 'تتبع الطاكسي',
      simulateMovement: 'حركة مباشرة',
      pauseSimulation: 'إيقاف مؤقت',
    },
    search: {
      resultsTitle: 'سيارات الأجرة المتوافقة',
      resultsSubtitle: 'يتم عرض سيارات الأجرة التي يطابق مسارها وجهتك فقط',
      matchingRuleNote: 'تصفية دقيقة حسب الاتجاه والمحطات المتوافقة',
      sortClosest: 'الأقرب',
      sortCheapest: 'الأقل سعراً',
      sortFastest: 'أقل وقت انتظار',
      sortComfortable: 'الأكثر راحة',
      filtersTitle: 'التصفية',
      taxiTypeLabel: 'نوع الطاكسي',
      maxPriceLabel: 'أقصى سعر (درهم)',
      maxWaitLabel: 'أقصى انتظار (دقيقة)',
      minSeatsLabel: 'الحد الأدنى للمقاعد',
      etaAway: 'الوصول خلال',
      seatsAvailable: 'مقاعد متاحة',
      estimatedFare: 'السعر التقديري',
      journeyDuration: 'المدة التقديرية',
      routeMatch: 'توافق المسار',
      selectSeatCta: 'اختيار مقعد',
      noResultsTitle: 'لم يتم العثور على طاكسي متوافق',
      noResultsDesc: 'لا توجد سيارة أجرة متجهة على هذا المسار حالياً ضمن هذه الفلاتر. جرب تعديل الفلاتر أو مساراً شائعاً.',
      modifySearch: 'تعديل البحث',
      searchingTaxis: 'جاري فحص المسارات المتوافقة...',
    },
    seatSelection: {
      title: 'التفاصيل واختيار المقعد',
      routePreview: 'مسار سيارة الأجرة',
      pickupPoint: 'نقطة الركوب',
      destinationPoint: 'وجهة المسافر',
      chooseSeat: 'اختر مقعدك',
      seatLegend: 'دليل المقاعد',
      driverCabin: 'السائق',
      selectedSeatLabel: 'المقعد المختار',
      noSeatSelected: 'اضغط على مقعد متاح باللون الأزرق الفاتح لحجزه.',
      fareBreakdown: 'تفاصيل التعريفة',
      baseSeatFare: 'سعر المقعد',
      platformFee: 'رسوم الخدمة',
      totalToPay: 'المجموع للدفع',
      continueToPayment: 'المتابعة للدفع',
      seatUnavailableError: 'تم حجز هذا المقعد للتو. يرجى اختيار مقعد آخر.',
    },
    payment: {
      title: 'الدفع الإلكتروني الآمن (محاكاة)',
      subtitle: 'لا يتم طلب أو حفظ أي بطاقة بنكية حقيقية.',
      summaryTitle: 'ملخص الحجز',
      methodTitle: 'وسيلة الدفع المحاكاة',
      methodCard: 'البطاقة البنكية المغربية (CMI محاكاة)',
      methodCardDesc: 'Visa / Mastercard · تأكيد فوري',
      methodWallet: 'محفظة TaxiSeat',
      methodWalletDesc: 'الرصيد التجريبي: 240 درهم',
      methodMobile: 'الدفع عبر الهاتف (M-Wallet)',
      methodMobileDesc: 'مصادقة سريعة عبر الهاتف',
      disclaimer: 'معاملة تجريبية: لن يتم خصم أي مبلغ حقيقي.',
      payNow: 'تأكيد والدفع',
      processing: 'جاري تأكيد الدفع...',
      successTitle: 'تم تأكيد الدفع',
      successDesc: 'تم حجز مقعدك مؤقتاً في انتظار تأكيد السائق.',
      viewBooking: 'تتبع حجزي',
    },
    bookings: {
      activeTitle: 'الحجوزات النشطة',
      historyTitle: 'سجل الرحلات',
      noActiveTitle: 'لا توجد حجوزات نشطة',
      noActiveDesc: 'ابحث عن سيارة أجرة مشتركة لحجز مقعدك القادم.',
      findFirstTaxi: 'البحث عن طاكسي',
      noHistoryTitle: 'لا توجد رحلات مكتملة أو ملغاة',
      noHistoryDesc: 'ستظهر رحلاتك السابقة وإيصالاتك هنا.',
      driverContact: 'التواصل مع السائق (محاكاة)',
      callDriver: 'اتصال',
      messageDriver: 'رسالة',
      simulatedCallNotice: 'تم بدء مكالمة محاكاة مع السائق:',
      cancelBooking: 'إلغاء الحجز',
      cancelConfirmText: 'سيتم تحرير المقعد فوراً وإرجاع المبلغ.',
      journeyCompletedBtn: 'اكتملت الرحلة — تأكيد الوصول',
      arrivalConfirmTitle: 'تأكيد الوصول إلى الوجهة',
      arrivalConfirmDesc: 'بعد تأكيدك، سيؤكد السائق نزولك لتحرير المقعد.',
      waitingDriverRelease: 'تم تأكيد وصولك · في انتظار تأكيد السائق لتحرير المقعد',
      seatReleasedNote: 'أكد السائق النزول · تم تحرير المقعد',
      rateDriverTitle: 'تقييم الرحلة',
      rateDriverDesc: 'كيف كانت تجربتك في هذه الرحلة المشتركة؟',
      rateCommentPlaceholder: 'ملاحظات اختيارية (الالتزام بالوقت، الراحة...)',
      submitRating: 'إرسال التقييم',
      ratedLabel: 'التقييم الممنوح',
      refundedBadge: 'مسترد',
      paidBadge: 'مدفوع',
      simulateDriverAdvance: 'محاكاة الخطوة التالية للسائق',
    },
    driver: {
      registerTitle: 'ملف السائق والمركبة',
      registerSubtitle: 'إدارة الرخصة، نوع سيارة الأجرة وعدد المقاعد.',
      statusOnline: 'متصل بالخدمة',
      statusOffline: 'خارج الخدمة',
      toggleAvailability: 'حالة العمل',
      acceptingBookings: 'يستقبل الحجوزات',
      pausedBookings: 'الحجوزات متوقفة مؤقتاً',
      currentLocation: 'الموقع الحالي',
      currentDestination: 'الوجهة النهائية',
      currentRoute: 'المسار النشط',
      availableSeats: 'المقاعد المتاحة',
      reservedSeats: 'المقاعد المحجوزة / المشغولة',
      activeBookings: 'الحجوزات النشطة',
      estimatedEarnings: 'أرباح اليوم',
      advanceRouteBtn: 'التقدم على المسار',
      manageRouteTitle: 'إدارة المسار والمقاعد',
      originLabel: 'نقطة البداية',
      destinationLabel: 'وجهة الطاكسي',
      addStopLabel: 'المحطات الوسيطة',
      startJourney: 'بدء الرحلة',
      endJourney: 'إنهاء الرحلة',
      updateRoute: 'تحديث المسار',
      seatControlTitle: 'التحكم اليدوي في المقاعد',
      seatControlDesc: 'اضغط على مقعد متاح أو مشغول يدوياً لتعديل التوفر.',
      incomingTitle: 'طلبات الحجز والركاب الحاليون',
      noBookingsTitle: 'لا توجد طلبات لهذا المسار',
      noBookingsDesc: 'فعّل حالة الاتصال لاستقبال حجوزات متوافقة مع مسارك.',
      accept: 'قبول',
      reject: 'رفض',
      markApproaching: 'في الطريق للراكب',
      confirmBoarding: 'تأكيد الركوب',
      confirmDeparture: 'تأكيد النزول',
      passengerConfirmedWait: 'أكد المسافر وصوله. يرجى تأكيد نزوله لتحرير المقعد.',
      earningsToday: 'اليوم',
      earningsWeek: 'هذا الأسبوع',
      earningsMonth: 'هذا الشهر',
      completedRides: 'الرحلات المكتملة',
      weeklyChartTitle: 'أرباح آخر 7 أيام (درهم)',
      recentPayouts: 'السجل المالي الأخير',
      licenseLabel: 'رقم رخصة الثقة / السياقة',
      modelLabel: 'طراز المركبة',
      plateLabel: 'رقم اللوحة',
      capacityLabel: 'سعة الركاب',
      switchDemoDriver: 'تبديل السائق التجريبي',
      updateProfileSuccess: 'تم تحديث بيانات السائق بنجاح.',
    },
    admin: {
      title: 'إدارة منصة TaxiSeat',
      subtitle: 'مراقبة الأسطول والمستخدمين والنشاط في مراكش',
      totalPassengers: 'المسافرون المسجلون',
      totalDrivers: 'السائقون المسجلون',
      activeTaxis: 'سيارات الأجرة النشطة',
      totalBookings: 'إجمالي الحجوزات',
      completedBookings: 'الرحلات المكتملة',
      cancelledBookings: 'الحجوزات الملغاة',
      platformRevenue: 'الإيرادات التقديرية',
      bookingsByStatus: 'توزيع الحجوزات حسب الحالة',
      topCorridors: 'المسارات الأكثر طلباً',
      fleetOccupancy: 'نسبة امتلاء الأسطول',
      completionRate: 'معدل الإتمام',
      cancellationRate: 'معدل الإلغاء',
      joinedDate: 'تاريخ الانضمام',
      tripsCount: 'الرحلات',
      verified: 'موثق',
      pending: 'قيد المراجعة',
      occupancy: 'الإشغال',
      corridorDemand: 'الطلب التقديري',
    },
  },
  en: {
    brandTagline: 'Shared urban taxi mobility in Morocco',
    welcome: {
      badge: 'Marrakech Pilot · Shared Mobility',
      title: 'Reserve your seat in a taxi already heading your way.',
      subtitle:
        'TaxiSeat connects passengers with Small and Large taxis travelling in the same direction. Compare compatible routes, pick your seat, and pay seamlessly.',
      feature1Title: 'Strict Route Matching',
      feature1Desc: 'Only taxis whose active route covers both your pickup and destination are shown.',
      feature2Title: 'Live Seat Visibility',
      feature2Desc: 'Inspect available seats across Small Taxis (3 seats) and Large Taxis (6 seats).',
      feature3Title: 'Integrated Pay & Tracking',
      feature3Desc: 'Clear MAD fares, live arrival tracking, and dual-confirmed trip completion.',
      continuePassenger: 'Passenger App',
      continueDriver: 'Driver Portal',
      continueAdmin: 'Admin Console',
      authTitle: 'Passenger Access',
      loginTab: 'Sign In',
      registerTab: 'Register',
      quickDemoBtn: 'Continue with demo account (Salma)',
      fullName: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      authErrorMissing: 'Please fill in all required fields.',
      authErrorInvalid: 'Please enter a valid email and a password of at least 4 characters.',
      demoNote: 'Interactive prototype using simulated Marrakech urban transport data.',
    },
    roles: {
      passenger: 'Passenger',
      driver: 'Driver',
      admin: 'Admin',
    },
    nav: {
      home: 'Home',
      search: 'Search',
      bookings: 'My bookings',
      history: 'History',
      profile: 'Profile',
      dashboard: 'Dashboard',
      route: 'My route',
      earnings: 'Earnings',
      overview: 'Overview',
      passengers: 'Passengers',
      drivers: 'Drivers',
      taxis: 'Taxis',
      analytics: 'Analytics',
    },
    common: {
      language: 'Language',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      close: 'Close',
      edit: 'Edit',
      signOut: 'Sign Out',
      loading: 'Loading...',
      simulatedNotice: 'Simulated demonstration environment',
      mad: 'MAD',
      min: 'min',
      km: 'km',
      seats: 'seats',
      seat: 'seat',
      available: 'Available',
      reserved: 'Reserved',
      occupied: 'Occupied',
      online: 'Online',
      offline: 'Offline',
      notifications: 'Notifications',
      markAllRead: 'Mark all read',
      noNotifications: 'No notifications yet.',
      viewAll: 'View all',
      driver: 'Driver',
      vehicle: 'Vehicle',
      plate: 'Plate',
      rating: 'Rating',
      status: 'Status',
      reference: 'Reference',
      actions: 'Actions',
      searchPlaceholder: 'Search...',
      all: 'All',
      reset: 'Reset',
    },
    taxiTypes: {
      small: 'Small Taxi',
      large: 'Large Taxi',
    },
    seatStatus: {
      available: 'Available',
      reserved: 'Reserved',
      occupied: 'Occupied',
    },
    bookingStatus: {
      pending_confirmation: 'Pending confirmation',
      confirmed: 'Confirmed',
      driver_approaching: 'Driver approaching',
      picked_up: 'Passenger picked up',
      completed: 'Journey completed',
      cancelled: 'Cancelled',
    },
    passengerHome: {
      title: 'Where are you heading today?',
      subtitle: 'Find a shared taxi already travelling towards your destination in Marrakech.',
      fromLabel: 'FROM: Current location',
      toLabel: 'TO: Where do you want to go?',
      fromPlaceholder: 'Select pickup point...',
      toPlaceholder: 'Enter or pick destination...',
      detectGps: 'Detect GPS',
      gpsDetected: 'Location detected: Guéliz (Place du 16 Novembre)',
      findTaxis: 'Find available taxis',
      swapLocations: 'Swap origin and destination',
      popularCorridors: 'Popular Marrakech corridors',
      activeTaxisOnMap: 'Active taxis on map',
      samePointError: 'Pickup and destination cannot be the same location.',
      missingPointError: 'Please choose both a pickup point and a destination.',
      activeTripBanner: 'Active trip in progress',
      trackTrip: 'Track taxi',
      simulateMovement: 'Live movement',
      pauseSimulation: 'Pause map',
    },
    search: {
      resultsTitle: 'Compatible Taxis',
      resultsSubtitle: 'Showing only taxis whose active route serves your pickup and destination',
      matchingRuleNote: 'Strict directional & route-corridor filtering active',
      sortClosest: 'Closest',
      sortCheapest: 'Cheapest',
      sortFastest: 'Shortest wait',
      sortComfortable: 'Most comfortable',
      filtersTitle: 'Filters',
      taxiTypeLabel: 'Taxi type',
      maxPriceLabel: 'Max price (MAD)',
      maxWaitLabel: 'Max wait (min)',
      minSeatsLabel: 'Min. seats',
      etaAway: 'Arrives in',
      seatsAvailable: 'seats available',
      estimatedFare: 'Estimated fare',
      journeyDuration: 'Est. duration',
      routeMatch: 'Route match',
      selectSeatCta: 'Select seat',
      noResultsTitle: 'No compatible taxis found',
      noResultsDesc:
        'No active taxi currently matches this direction within your filter limits. Try relaxing filters or choosing a popular corridor.',
      modifySearch: 'Modify route',
      searchingTaxis: 'Matching active taxi corridors...',
    },
    seatSelection: {
      title: 'Taxi Details & Seat Selection',
      routePreview: 'Active taxi route',
      pickupPoint: 'Pickup point',
      destinationPoint: 'Your destination',
      chooseSeat: 'Select your seat',
      seatLegend: 'Seat legend',
      driverCabin: 'Driver',
      selectedSeatLabel: 'Selected seat',
      noSeatSelected: 'Tap an available seat in light blue to reserve it.',
      fareBreakdown: 'Fare breakdown',
      baseSeatFare: 'Seat fare',
      platformFee: 'Booking fee',
      totalToPay: 'Total due',
      continueToPayment: 'Proceed to payment',
      seatUnavailableError: 'This seat was just reserved. Please pick another seat.',
    },
    payment: {
      title: 'Simulated Online Payment',
      subtitle: 'No real bank card details are requested or stored.',
      summaryTitle: 'Booking Summary',
      methodTitle: 'Choose simulated payment method',
      methodCard: 'Moroccan Bank Card (Simulated CMI)',
      methodCardDesc: 'Visa / Mastercard · Instant test authorization',
      methodWallet: 'TaxiSeat Wallet',
      methodWalletDesc: 'Demo balance: 240 MAD',
      methodMobile: 'Mobile Pay (M-Wallet)',
      methodMobileDesc: 'Quick phone verification',
      disclaimer: 'Demonstration transaction: no real funds will be charged.',
      payNow: 'Confirm & Pay',
      processing: 'Authorizing simulated payment...',
      successTitle: 'Payment Confirmed',
      successDesc: 'Your seat is temporarily held while awaiting driver confirmation.',
      viewBooking: 'Track my booking',
    },
    bookings: {
      activeTitle: 'Active Bookings',
      historyTitle: 'Journey History',
      noActiveTitle: 'No active bookings',
      noActiveDesc: 'Search for a shared taxi travelling your way to reserve a seat.',
      findFirstTaxi: 'Find a taxi',
      noHistoryTitle: 'No past or cancelled rides',
      noHistoryDesc: 'Completed rides and receipts will appear here.',
      driverContact: 'Driver contact (simulated)',
      callDriver: 'Call',
      messageDriver: 'Message',
      simulatedCallNotice: 'Simulated call started with driver:',
      cancelBooking: 'Cancel booking',
      cancelConfirmText: 'Your reserved seat will be released and your payment refunded.',
      journeyCompletedBtn: 'Journey completed — Confirm arrival',
      arrivalConfirmTitle: 'Confirm Arrival at Destination',
      arrivalConfirmDesc:
        'After you confirm, the driver will confirm your departure to release the seat.',
      waitingDriverRelease: 'Arrival confirmed by you · Waiting for driver departure confirmation to release seat',
      seatReleasedNote: 'Driver confirmed departure · Seat released',
      rateDriverTitle: 'Rate your driver',
      rateDriverDesc: 'How was your shared taxi experience?',
      rateCommentPlaceholder: 'Optional feedback (punctuality, vehicle comfort...)',
      submitRating: 'Submit rating',
      ratedLabel: 'Rating submitted',
      refundedBadge: 'Refunded',
      paidBadge: 'Paid',
      simulateDriverAdvance: 'Simulate next driver step',
    },
    driver: {
      registerTitle: 'Driver & Vehicle Profile',
      registerSubtitle: 'Manage your licence details, taxi type, and seat capacity.',
      statusOnline: 'Online',
      statusOffline: 'Offline',
      toggleAvailability: 'Availability',
      acceptingBookings: 'Accepting bookings',
      pausedBookings: 'Bookings paused',
      currentLocation: 'Current location',
      currentDestination: 'Current destination',
      currentRoute: 'Active route',
      availableSeats: 'Available seats',
      reservedSeats: 'Reserved / occupied',
      activeBookings: 'Active bookings',
      estimatedEarnings: "Today's earnings",
      advanceRouteBtn: 'Advance along route',
      manageRouteTitle: 'Route & Capacity Controls',
      originLabel: 'Start point',
      destinationLabel: 'Taxi destination',
      addStopLabel: 'Intermediate stops',
      startJourney: 'Start journey',
      endJourney: 'End journey',
      updateRoute: 'Update route',
      seatControlTitle: 'Manual Seat Management',
      seatControlDesc: 'Tap unbooked seats to adjust walk-in occupancy.',
      incomingTitle: 'Booking Requests & Active Passengers',
      noBookingsTitle: 'No bookings on this route yet',
      noBookingsDesc: 'Stay online to receive seat reservations matching your route.',
      accept: 'Accept',
      reject: 'Reject',
      markApproaching: 'Approaching',
      confirmBoarding: 'Confirm boarding',
      confirmDeparture: 'Confirm departure',
      passengerConfirmedWait: 'Passenger confirmed arrival. Confirm departure to release their seat.',
      earningsToday: 'Today',
      earningsWeek: 'This week',
      earningsMonth: 'This month',
      completedRides: 'Completed rides',
      weeklyChartTitle: 'Last 7 days earnings (MAD)',
      recentPayouts: 'Recent financial history',
      licenseLabel: 'Driver Licence / Permit ID',
      modelLabel: 'Vehicle model',
      plateLabel: 'Registration plate',
      capacityLabel: 'Passenger seats',
      switchDemoDriver: 'Switch demo driver',
      updateProfileSuccess: 'Driver profile and vehicle settings saved.',
    },
    admin: {
      title: 'TaxiSeat Administration',
      subtitle: 'Fleet, user, booking lifecycle, and Marrakech corridor monitoring',
      totalPassengers: 'Registered passengers',
      totalDrivers: 'Registered drivers',
      activeTaxis: 'Active taxis',
      totalBookings: 'Total bookings',
      completedBookings: 'Completed rides',
      cancelledBookings: 'Cancelled bookings',
      platformRevenue: 'Estimated revenue',
      bookingsByStatus: 'Bookings by status',
      topCorridors: 'Top Marrakech corridors',
      fleetOccupancy: 'Fleet occupancy rate',
      completionRate: 'Completion rate',
      cancellationRate: 'Cancellation rate',
      joinedDate: 'Joined',
      tripsCount: 'Trips',
      verified: 'Verified',
      pending: 'Pending',
      occupancy: 'Occupancy',
      corridorDemand: 'Demand volume',
    },
  },
};
