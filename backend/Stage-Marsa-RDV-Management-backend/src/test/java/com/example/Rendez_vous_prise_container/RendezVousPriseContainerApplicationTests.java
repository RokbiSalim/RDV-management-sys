package com.example.Rendez_vous_prise_container;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.example.Rendez_vous_prise_container.Config.TestJwtDecoderConfig;

@SpringBootTest
@Import(TestJwtDecoderConfig.class)
class RendezVousPriseContainerApplicationTests {

	@Test
	void contextLoads() {
	}

}
