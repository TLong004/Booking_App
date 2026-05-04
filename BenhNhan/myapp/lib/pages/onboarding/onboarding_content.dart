class OnboardingContent {
  final String image;
  final String title;
  final String description;

  OnboardingContent({required this.image, required this.title, required this.description});
}

List<OnboardingContent> contents = [
  OnboardingContent(
    image: 'lib/images/onboarding1.jpg',
    title: 'Choose the Doctor you want.',
    description: 'Tìm kiếm bác sĩ chuyên khoa phù hợp với nhu cầu của bạn chỉ với vài thao tác.',
  ),
  OnboardingContent(
    image: 'lib/images/onboarding2.jpg',
    title: 'Get Healthcare everywhere.',
    description: 'Nhận tư vấn y tế trực tuyến mọi lúc, mọi nơi ngay trên điện thoại.',
  ),
  OnboardingContent(
    image: 'lib/images/onboarding3.jpg',
    title: 'Welcome',
    description: 'Chào mừng bạn đến với ứng dụng chăm sóc sức khỏe toàn diện.',
  ),
];