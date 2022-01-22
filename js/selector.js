myOptions = [
    { label: 'Réanimations', value: 'rea', description: "Nombre de patients actuellement en réanimation ou en soins intensifs" },
    { label: 'Hospitalisations', value: 'hosp', description: "Nombre de patients actuellement hospitalisés pour COVID-19."},
    { label: 'Retours à domicile', value: 'rad', description: "Nombre cumulé de patients ayant été hospitalisés pour COVID-19 et de retour à domicile en raison de l'amélioration de leur état de santé."},
    { label: "Décès à l'hopital", value: 'dchosp', description: "Décès à l’hôpital dû à la COVID-19." },
  ];

VirtualSelect.init({
    ele: '#multiple-select',
    options: myOptions,
    multiple: true,
    placeholder: "Sélectionnez les données à afficher dans le graph",
    search: false
});