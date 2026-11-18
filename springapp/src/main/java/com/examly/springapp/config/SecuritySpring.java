package com.examly.springapp.config;
import java.util.Arrays;
import com.examly.springapp.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
@Configuration
@EnableMethodSecurity
public class SecuritySpring {
 @Bean
 public SecurityFilterChain securityFilterChain(HttpSecurity http,JwtAuthenticationFilter jwtFilter)throws Exception{
  http.cors(Customizer.withDefaults()).csrf(csrf->csrf.disable())
   .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(auth->auth
    .requestMatchers("/Auth/register","/Auth/check").permitAll()
    .requestMatchers("/swagger-ui/**","/v3/api-docs/**").permitAll()
    .requestMatchers(HttpMethod.GET,"/flights/**","/hotels/**").permitAll()
    .requestMatchers(HttpMethod.GET,"/api/bookings").hasRole("ADMIN")
    .requestMatchers("/Auth/adminRegistration","/Auth/show","/Auth/delete/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.POST,"/flights/**","/hotels/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.PUT,"/flights/**","/hotels/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.DELETE,"/flights/**","/hotels/**").hasRole("ADMIN")
    .requestMatchers("/api/bookings/**").hasAnyRole("CUSTOMER","ADMIN")
    .requestMatchers("/Auth/**").hasAnyRole("CUSTOMER","ADMIN")
    .anyRequest().authenticated())
   .addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class);
  return http.build();
 }
 @Bean
 public CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:8081}")String origins){
  CorsConfiguration c=new CorsConfiguration();
  c.setAllowedOrigins(Arrays.stream(origins.split(",")).map(String::trim).filter(s->!s.isEmpty()).toList());
  c.setAllowedMethods(Arrays.asList("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
  c.setAllowedHeaders(Arrays.asList("Authorization","Content-Type","Accept"));
  c.setExposedHeaders(Arrays.asList("Authorization")); c.setAllowCredentials(false); c.setMaxAge(3600L);
  UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource();s.registerCorsConfiguration("/**",c);return s;
 }
 @Bean public PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
}