package com.inspivia.ai.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(AiServiceProperties.class)
public class AiClientConfig {

    public static final String SERVICE_KEY_HEADER = "X-Service-Key";

    @Bean
    public RestClient aiRestClient(AiServiceProperties props) {
        return buildRestClient(props);
    }

    /** Static so tests can build the exact production client without a Spring context. */
    public static RestClient buildRestClient(AiServiceProperties props) {
        // The AI hop uses snake_case and tolerates additive fields. This mapper is private to
        // the AI client so it cannot change how the frontend-facing API serialises.
        ObjectMapper mapper = new ObjectMapper()
                .findAndRegisterModules()
                .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(props.connectTimeout());
        factory.setReadTimeout(props.readTimeout());

        return RestClient.builder()
                .baseUrl(props.baseUrl())
                .requestFactory(factory)
                .defaultHeader(SERVICE_KEY_HEADER, props.serviceKey())
                .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
                .messageConverters(converters -> {
                    converters.clear();
                    converters.add(new MappingJackson2HttpMessageConverter(mapper));
                })
                .build();
    }
}
